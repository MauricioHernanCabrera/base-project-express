const UserService = require('./user');
const { config } = require('./../config');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const register = ({ data }) => UserService.createOne({ data });

const createForgotPassword = async ({ filter }) => {
  const { email } = filter;

  const userFound = await UserService.getOne({ filter: { email } });

  const resetPasswordToken = require('crypto')
    .randomBytes(32)
    .toString('hex');
  const resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await UserService.updateOne({
    filter: { _id: userFound._id },
    data: {
      resetPasswordToken,
      resetPasswordExpires
    }
  });

  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.nodemailerEmail,
      pass: config.nodemailerPassword
    }
  });

  const mailOptions = {
    to: email,
    from: config.nodemailerEmail,
    subject: 'CEO reiniciar contraseña',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${config.frontUrl}/auth/reset/${resetPasswordToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  smtpTransport.sendMail(mailOptions);
};

const getResetPasswordToken = ({ filter }) => {
  const { resetPasswordToken } = filter;
  const resetPasswordExpires = Date.now();

  return UserService.getOne({
    filter: {
      resetPasswordToken,
      resetPasswordExpires: { $gte: resetPasswordExpires }
    },
    select: ['email', 'username'],
    failText: 'Expiro el token para recuperar tu cuenta'
  });
};

const createResetPasswordToken = async ({ filter, data }) => {
  const { resetPasswordToken } = filter;
  const { password } = data;

  const resetPasswordExpires = Date.now();

  const userFound = await UserService.getOne({
    filter: {
      resetPasswordToken,
      resetPasswordExpires: { $gte: resetPasswordExpires }
    },
    select: ['email'],
    failText: 'Expiro el token para recuperar tu cuenta'
  });

  return UserService.updateOne({
    filter: { _id: userFound._id },
    data: { password, resetPasswordExpires }
  });
};

const getToken = ({ data, req }) => {
  const { user } = data;

  return new Promise((res, rej) => {
    req.login(user, { session: false }, (error) => {
      if (error) rej(error);

      const { password, resetPasswordToken, resetPasswordExpires, ...rest } = user._doc;
      const payload = rest;

      const token = jwt.sign(payload, config.authJwtSecret, {
        expiresIn: '365d'
      });

      res(token);
    });
  });
};

module.exports = {
  register,
  createForgotPassword,
  getResetPasswordToken,
  createResetPasswordToken,
  getToken
};
