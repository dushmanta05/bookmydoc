/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path');
const ejs = require('ejs');
const { sendMail } = require('../utils/sendMail');
const {
  trimWhitespace,
  checkNullValues,
  checkRequiredFields,
  isEmailValid,
  hashPassword
} = require('../utils/utils');
const { generateToken } = require('../utils/tokenUtils');

module.exports = {
  create: async function (req, res) {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'speciality'
    ];

    const trimReqBody = trimWhitespace(req.body);
    const { firstName, lastName, email, password, speciality } = trimReqBody;

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
        message: 'email address already in use',
        error: 'duplicate email address'
      });
    }

    const hashedPassword = await hashPassword(password);
    const resetToken = generateToken();

    try {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        resetToken: resetToken,
        userType: 'doctor'
      };

      const createdUser = await User.create(userData).fetch();

      try {
        const createdDoctor = await Doctor.create({
          speciality,
          user: createdUser.id
        }).fetch();

        const resetPasswordLink = `http://localhost:1337/reset-password?token=${createdUser.resetToken}`;

        const htmlFilePath = path.join(
          __dirname,
          '..',
          'emails',
          'doctor-welcome.ejs'
        );

        const renderedHtml = await ejs.renderFile(htmlFilePath, {
          firstName,
          resetPasswordLink
        });

        const emailResponse = await sendMail(
          email,
          'Welcome to Doctegrity',
          renderedHtml
        );
        if (!emailResponse.status) {
          return res.status(500).json(emailResponse);
        }

        return res.status(201).json({
          status: true,
          message: 'doctor created successfully',
          doctorData: createdDoctor
        });
      } catch (error) {
        await User.destroyOne({ id: createdUser.id });
        return res.status(400).json({
          status: false,
          message: 'failed to create doctor',
          error: error.details
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'failed to create doctor',
        error: error.details
      });
    }
  }
};
