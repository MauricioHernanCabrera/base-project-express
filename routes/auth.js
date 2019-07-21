const express = require('express');
const router = express();
const nodemailer = require('nodemailer');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

const validation = require('./../utils/middlewares/validationHandler');
const {
  registerAuthSchema,
  forgotSchema,
  resetSchema
} = require('./../utils/schemas/auth');
const { UserService } = require('./../services');
const { config } = require('./../config');

// Basic strategy
require('./../utils/auth/strategies/basic');
// JWT
require('./../utils/auth/strategies/jwt');

router.post('/register', validation(registerAuthSchema), async function(
  req,
  res,
  next
) {
  try {
    const { body: data } = req;

    await UserService.createOne({ data });

    res.status(201).json({
      message: '¡Usuario creado!'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/token', async function(req, res, next) {
  passport.authenticate('basic', function(error, user) {
    try {
      if (error || !user) {
        next(boom.unauthorized());
      }

      req.login(user, { session: false }, async function(error) {
        if (error) next(error);

        const { username: sub, email } = user;

        const payload = { sub, email };

        const access_token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '14d'
        });

        return res.status(200).json({
          message: '¡Usuario autenticado!',
          data: { access_token }
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  function(req, res, next) {
    res.status(200).json({ message: '¡El token es valido!' });
  }
);

router.post('/forgot', validation(forgotSchema), async function(
  req,
  res,
  next
) {
  try {
    const { email } = req.body;

    const userFound = await UserService.getOne({
      filter: { email }
    });

    const resetPasswordToken = require('crypto')
      .randomBytes(32)
      .toString('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    const userUpdated = await UserService.updateOne({
      filter: { _id: userFound._id },
      data: {
        resetPasswordToken,
        resetPasswordExpires
      }
    });

    var smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.nodemailEmail,
        pass: config.nodemailPassword
      }
    });

    var mailOptions = {
      to: email,
      from: config.nodemailEmail,
      subject: 'Apuntus reiniciar contraseña',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'https://apuntus.com/auth/reset/' +
        resetPasswordToken +
        '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    await smtpTransport.sendMail(mailOptions);

    res.status(200).json({
      message: 'Te enviamos un mail para que recuperes tu contraseña'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/reset/:resetPasswordToken', async function(req, res, next) {
  try {
    const { resetPasswordToken } = req.params;
    const resetPasswordExpires = Date.now();

    const userFound = await UserService.getOne({
      filter: {
        resetPasswordToken,
        resetPasswordExpires: { $gte: resetPasswordExpires }
      },
      select: ['email'],
      failText: 'Expiro el token para recuperar tu cuenta'
    });

    res.status(200).json({
      data: userFound,
      message: 'Usuario recuperado'
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/reset/:resetPasswordToken',
  validation(resetSchema),
  async function(req, res, next) {
    try {
      const { resetPasswordToken } = req.params;
      const { password } = req.body;
      const resetPasswordExpires = Date.now();

      const userFound = await UserService.getOne({
        filter: {
          resetPasswordToken,
          resetPasswordExpires: { $gte: resetPasswordExpires }
        },
        select: ['email'],
        failText: 'Expiro el token para recuperar tu cuenta'
      });

      await UserService.updateOne({
        filter: { _id: userFound._id },
        data: { password, resetPasswordExpires }
      });

      res.status(200).json({
        message: '¡Contraseña actualizada!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
