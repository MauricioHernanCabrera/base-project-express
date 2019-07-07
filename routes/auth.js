const express = require('express');
const router = express();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

const validation = require('./../utils/middlewares/validationHandler');
const { registerAuthSchema } = require('./../utils/schemas/auth');
const { UserService } = require('./../services');
const userService = new UserService();
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

    await userService.createUser({ data });

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

// router.post('/reset_password', async function (req, res, next) {})
// router.post('/confirm_reset_password', async function (req, res, next) {})

module.exports = router;
