/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { generateToken } = require("../utils/tokenUtils");
const {
  trimWhitespace,
  checkNullValues,
  checkRequiredFields,
  isEmailValid,
  hashPassword,
} = require("../utils/utils");

module.exports = {
  create: async function (req, res) {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "password",
        "userType",
      ];
      const trimReqBody = trimWhitespace(req.body);

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

      const emailValidationResponse = isEmailValid(trimReqBody.email);
      if (!emailValidationResponse.status) {
        return res.status(400).json(emailValidationResponse);
      }

      const existingUser = await User.findOne({ email: trimReqBody.email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "email address already in use",
          error: "duplicate email address",
        });
      }

      const resetToken = generateToken();

      const hashedPassword = await hashPassword(trimReqBody.password);

      const userData = {
        ...trimReqBody,
        password: hashedPassword,
        resetToken: resetToken,
      };

      const createdUser = await User.create(userData).fetch();
      return res.status(201).json({
        status: true,
        message: "user created successfully",
        data: createdUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "failed to create user",
        error: error.details,
      });
    }
  },

  resetPassword: async function (req, res) {
    const { newPassword } = req.body;
    const { token } = req.query;

    try {
      const user = await User.findOne({ resetToken: token });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Invalid token",
          error: "Token is expired or invalid",
        });
      }

      const hashedPassword = await hashPassword(newPassword);

      const updatedUser = await User.update({ resetToken: token })
        .set({ password: hashedPassword, resetToken: null })
        .fetch();

      if (!updatedUser) {
        return res.status(400).json({
          status: false,
          message: "invalid token",
          error: "token is expired or invalid",
        });
      }

      return res
        .status(200)
        .json({ status: true, message: "password reset successful" });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "failed to reset password",
        error: error.details || error.message,
      });
    }
  },
};
