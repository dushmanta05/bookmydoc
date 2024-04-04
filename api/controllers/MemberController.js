/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { checkRequiredFields } = require("../utils/utils");

function capitalizeName(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
  create: async function (req, res) {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "disease",
    ];

    const requiredFieldsresponse = checkRequiredFields(
      res,
      req.body,
      requiredFields
    );
    if (requiredFieldsresponse) {
      return requiredFieldsresponse;
    }

    const emailValidationResponse = isEmailValid(res, req.body.email);
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
        userType: "member",
      };

      let createdUser = await User.create(userData).fetch();

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
          error: "invalid member details",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to create member",
        error: "invalid data entered",
      });
    }
  },
};
