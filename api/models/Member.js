/**
 * Member.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    disease: { type: "string", required: true },
    isMemberFlagged: { type: "boolean", allowNull: true },

    user: { model: "user", unique: true },
  },
};
