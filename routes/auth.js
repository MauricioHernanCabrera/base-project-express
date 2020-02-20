const express = require('express');
const router = express();

const passport = require('passport');
const boom = require('@hapi/boom');

const { validationMiddleware } = require('./../utils/middlewares/validationHandler');

const { AuthSchema } = require('./../utils/schemas');
const { AuthService } = require('./../services');

// Basic strategy
require('./../utils/auth/strategies/basic');

// JWT
require('./../utils/auth/strategies/jwt');

router.post(
  '/register',
  validationMiddleware(AuthSchema.register), // prettier-ignore
  async (req, res, next) => {
    try {
      const { body: data } = req;

      await AuthService.register({ data });

      res.status(201).json({
        message: '¡Usuario registrado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/token', (req, res, next) => {
  passport.authenticate('basic', async (error, user) => {
    try {
      if (error || !user) {
        next(boom.badRequest('¡Nombre de usuario o contraseña incorrecto!'));
      }

      const token = await AuthService.getToken({ data: { user }, req });

      res.status(200).json({
        message: '¡Usuario autenticado!',
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.get(
  '/verify',
  passport.authenticate('jwt', { session: false, }),
  (req, res, next) => {
    res.status(200).json({ message: '¡El token es valido!' });
  }
);

router.post(
  '/forgot',
  validationMiddleware(AuthSchema.forgot), // prettier-ignore
  async (req, res, next) => {
    try {
      const { email } = req.body;

      await AuthService.createForgotPassword({ filter: { email } });

      res.status(200).json({
        message: 'Te enviamos un mail para que recuperes tu contraseña'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/reset/:resetPasswordToken', async (req, res, next) => {
  try {
    const { resetPasswordToken } = req.params;

    const data = await AuthService.getResetPasswordToken({
      filter: { resetPasswordToken }
    });

    res.status(200).json({
      data,
      message: 'Usuario recuperado'
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/reset/:resetPasswordToken',
  validationMiddleware(AuthSchema.reset),
  async (req, res, next) => {
    try {
      const { resetPasswordToken } = req.params;
      const { password } = req.body;

      await AuthService.createResetPasswordToken({
        filter: { resetPasswordToken },
        data: { password }
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
