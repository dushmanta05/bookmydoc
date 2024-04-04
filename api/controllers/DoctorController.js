/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const {
  checkRequiredFields,
  isEmailValid,
  trimWhitespace,
} = require("../utils/utils");

module.exports = {
  create: async function (req, res) {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "speciality",
    ];

    const trimReqBody = trimWhitespace(req.body);

    const requiredFieldsResponse = checkRequiredFields(
      res,
      trimReqBody,
      requiredFields
    );
    if (requiredFieldsResponse) {
      return requiredFieldsResponse;
    }
    console.log(trimReqBody);

    const emailValidationResponse = isEmailValid(res, trimReqBody.email);
    if (emailValidationResponse) {
      return emailValidationResponse;
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "email address already in use",
        error: "duplicate email address",
      });
    }

    try {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: "doctor",
      };

      let createdUser = await User.create(userData).fetch();

      try {
        let createdDoctor = await Doctor.create({
          speciality,
          user: createdUser.id,
        }).fetch();

        return res.status(201).json({
          status: true,
          message: "doctor created successfully",
          doctorData: createdDoctor,
        });
      } catch (error) {
        await User.destroyOne({ id: createdUser.id });
        return res.status(400).json({
          status: false,
          message: "failed to create doctor",
          error: "invalid member details",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "failed to create doctor",
        error: "invalid data entered",
      });
    }
  },
};
