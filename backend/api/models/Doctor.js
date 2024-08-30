/**
 * Doctor.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    specialty: { type: 'string', required: true },

    user: { model: 'user', unique: true }
  }
};
