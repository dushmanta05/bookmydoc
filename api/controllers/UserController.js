/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    try {
      const data = req.allParams();
      return res
        .status(201)
        .json({ message: "User created successfully", data: data });
    } catch (error) {
      return res.status(500).json({ error: "Error" });
    }
  },
};
