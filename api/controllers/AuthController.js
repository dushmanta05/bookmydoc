/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  trimWhitespace,
  checkNullValues,
  checkRequiredFields,
  isEmailValid,
} = require("../utils/utils");

module.exports = {
  login: async function (req, res) {
    try {
      const requiredFields = ["email", "password"];
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

      const user = await User.findOne({ email: trimReqBody.email });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "user not found",
          error: "invalid email",
        });
      }

      const validPassword = await bcrypt.compare(
        trimReqBody.password,
        user.password
      );

      if (!validPassword) {
        return res
          .status(401)
          .json({ status: false, message: "invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        status: true,
        message: "logged in successfully",
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "failed to login",
        error: error.message,
      });
    }
  },
};
