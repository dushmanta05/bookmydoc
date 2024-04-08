/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require("path");
const ejs = require("ejs");
const csvParser = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");

const { sendMail } = require("../utils/sendMail");
const {
  trimWhitespace,
  checkNullValues,
  checkRequiredFields,
  isEmailValid,
  hashPassword,
} = require("../utils/utils");
const { generateToken } = require("../utils/tokenUtils");

module.exports = {
  create: async function (req, res) {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "disease",
    ];

    const trimReqBody = trimWhitespace(req.body);
    const { firstName, lastName, email, password, disease } = trimReqBody;

    const nullValuesResponse = checkNullValues(trimReqBody);
    if (!nullValuesResponse.status) {
      return res.status(400).json(nullValuesResponse);
    }

    const requiredFieldsResponse = checkRequiredFields(
      trimReqBody,
      requiredFields
    );
    if (!requiredFieldsResponse.status) {
      return res.status(400).json(requiredFieldsResponse);
    }

    const emailValidationResponse = isEmailValid(email);
    if (!emailValidationResponse.status) {
      return res.status(400).json(emailValidationResponse);
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "email address already in use",
        error: "duplicate email address",
      });
    }
    const hashedPassword = await hashPassword(password);
    const resetToken = generateToken();

    try {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        resetToken: resetToken,
        userType: "member",
      };

      const createdUser = await User.create(userData).fetch();

      try {
        const createdMember = await Member.create({
          disease,
          user: createdUser.id,
        }).fetch();

        const resetPasswordLink = `http://localhost:1337/reset-password?token=${createdUser.resetToken}`;

        const htmlFilePath = path.join(
          __dirname,
          "..",
          "emails",
          "member-welcome.ejs"
        );

        const renderedHtml = await ejs.renderFile(htmlFilePath, {
          firstName,
          resetPasswordLink,
        });

        const emailResponse = await sendMail(
          email,
          "Welcome to Doctegrity",
          renderedHtml
        );
        if (!emailResponse.status) {
          return res.status(500).json(emailResponse);
        }

        return res.status(201).json({
          status: true,
          message: "member created successfully",
          memberData: createdMember,
        });
      } catch (error) {
        await User.destroyOne({ id: createdUser.id });
        return res.status(400).json({
          status: false,
          message: "failed to create member",
          error: error.details,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "failed to create member",
        error: error.details,
      });
    }
  },

  uploadCSV: async function (req, res) {
    try {
      const uploadFile = req.file("avatar");
      uploadFile.upload(
        {
          dirname: "../../uploads",
        },
        async (error, files) => {
          if (error) {
            return res.status(500).json({
              status: false,
              message: "Failed to upload",
              error: error.message || error.details,
            });
          }

          if (files.length === 0) {
            return res.status(400).json({
              status: false,
              message: "No file uploaded",
            });
          }

          const filePath = files[0].fd;
          const successfulCreations = [];
          const failedCreations = [];
          const csvData = [];

          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (data) => csvData.push(data))
            .on("end", async () => {
              for (const data of csvData) {
                const requiredFields = [
                  "firstName",
                  "lastName",
                  "email",
                  "password",
                  "disease",
                ];
                const trimReqBody = trimWhitespace(data);
                const { firstName, lastName, email, password, disease } =
                  trimReqBody;

                const nullValuesResponse = checkNullValues(trimReqBody);
                if (!nullValuesResponse.status) {
                  failedCreations.push({
                    user: email,
                    remark: "contains null values",
                  });
                  continue;
                }

                const requiredFieldsResponse = checkRequiredFields(
                  trimReqBody,
                  requiredFields
                );
                if (!requiredFieldsResponse.status) {
                  failedCreations.push({
                    user: email,
                    remark: "missing required field values",
                  });
                  continue;
                }

                const emailValidationResponse = isEmailValid(email);
                if (!emailValidationResponse.status) {
                  failedCreations.push({
                    user: email,
                    remark: "invalid email",
                  });
                  continue;
                }

                /*
                const existingUser = await User.findOne({ email: email });

                if (existingUser) {
                  const updateData = {};
                  if (existingUser.firstName !== firstName) {
                    updateData.firstName = firstName;
                  }
                  if (existingUser.lastName !== lastName) {
                    updateData.lastName = lastName;
                  }
                  if (existingUser.disease !== disease) {
                    updateData.disease = disease;
                  }
                  if (Object.keys(updateData).length > 0) {
                    try {
                      await User.updateOne({ id: existingUser.id }).set(
                        updateData
                      );
                      successfulCreations.push({
                        user: email,
                        remark: "user updated",
                      });
                      continue;
                    } catch (error) {
                      failedCreations.push({
                        user: email,
                        remark: error.message,
                      });
                      continue;
                    }
                  }
                } else {
                  continue;
                }
                */

                const hashedPassword = await hashPassword(password);
                const resetToken = generateToken();
                const createdUser = await User.create({
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  password: hashedPassword,
                  resetToken: resetToken,
                  userType: "member",
                }).fetch();

                if (createdUser) {
                  try {
                    await Member.create({
                      disease,
                      user: createdUser.id,
                    }).fetch();

                    successfulCreations.push({
                      user: email,
                      remark: "member created",
                    });
                    continue;
                  } catch (error) {
                    await User.destroyOne({ id: createdUser.id });
                    failedCreations.push({
                      user: email,
                      remark: error.message,
                    });
                  }
                }
              }
              await writeCsvFiles(successfulCreations, failedCreations);
              return res.status(200).json({
                status: true,
                message: "CSV data processed successfully",
              });
            });
        }
      );
    } catch (error) {
      return res.status(500).json({
        message: "Failed to upload file",
        error: error.message || error.details,
      });
    }
  },
};

async function writeCsvFiles(successfulCreations, failedCreations) {
  const successfulCsvFilePath = path.join(
    __dirname,
    "..",
    "..",
    "csv",
    "successful_creations.csv"
  );
  const failedCsvFilePath = path.join(
    __dirname,
    "..",
    "..",
    "csv",
    "failed_creations.csv"
  );
  const csvWriterSuccess = createObjectCsvWriter({
    path: successfulCsvFilePath,
    header: [
      { id: "user", title: "User" },
      { id: "remark", title: "Remark" },
    ],
  });

  const csvWriterFailed = createObjectCsvWriter({
    path: failedCsvFilePath,
    header: [
      { id: "user", title: "User" },
      { id: "remark", title: "Remark" },
    ],
  });

  await csvWriterSuccess.writeRecords(successfulCreations);
  await csvWriterFailed.writeRecords(failedCreations);
}
