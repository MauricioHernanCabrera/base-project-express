const express = require('express');
const router = express();

const passport = require('passport');
const boom = require('@hapi/boom');

const validation = require('./../utils/middlewares/validationHandler');

const { AuthSchema } = require('./../utils/schemas');
const { AuthService } = require('./../services');

// Basic strategy
require('./../utils/auth/strategies/basic');
// JWT
require('./../utils/auth/strategies/jwt');
require('./../utils/auth/strategies/facebook-token');

router.post(
  '/register',
  validation(AuthSchema.register), // prettier-ignore
  async function(req, res, next) {
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

router.get('/token', function(req, res, next) {
  passport.authenticate('basic', async function(error, user) {
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
  passport.authenticate('jwt', { session: false }),
  function(req, res, next) {
    res.status(200).json({ message: '¡El token es valido!' });
  }
);

router.post(
  '/forgot',
  validation(AuthSchema.forgot), // prettier-ignore
  async function(req, res, next) {
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

router.get('/reset/:resetPasswordToken', async function(req, res, next) {
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
  validation(AuthSchema.reset),
  async function(req, res, next) {
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

router.get(
  '/gapi_token',
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    const url = await AuthService.getTokenGoogle();

    res.status(301).json({
      data: url,
      message: 'Redirección'
    });
  }
);

router.post(
  '/gapi_token',
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { code } = req.body;

      const data = await AuthService.setTokenGoogle({ data: { code } });

      res.status(201).json({
        data,
        message: 'Token cargado'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
