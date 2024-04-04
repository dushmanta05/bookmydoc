/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    try {
      const userData = req.allParams();
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "email address already in use",
          error: "duplicate email address",
        });
      }

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
};
