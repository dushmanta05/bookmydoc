/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const {
  trimWhitespace,
  checkNullValues,
  checkRequiredFields,
  isEmailValid,
} = require("../utils/utils");

module.exports = {
  create: async function (req, res) {
    try {
      const requiredFields = ["firstName", "lastName", "email", "password"];
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

      const createdUser = await User.create(trimReqBody).fetch();
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
};
