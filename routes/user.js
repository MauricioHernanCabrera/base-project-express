const express = require('express');
const router = express();
const passport = require('passport');
const boom = require('@hapi/boom');

require('./../utils/auth/strategies/jwt');

router.get('/me', async (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    try {
      if (error || !user) next(boom.badRequest('¡Nombre de usuario o contraseña incorrecto!'));

      res.status(200).json({
        message: '¡Usuario obtenido!',
        data: user
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});


module.exports = router;
