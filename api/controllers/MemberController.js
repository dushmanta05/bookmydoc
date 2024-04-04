/**
 * MemberController
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

    try {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: "member",
      };

      const createdUser = await User.create(userData).fetch();

      try {
        let createdMember = await Member.create({
          disease,
          user: createdUser.id,
        }).fetch();

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
};
