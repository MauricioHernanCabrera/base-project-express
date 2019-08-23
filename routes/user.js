const express = require('express');
const router = express();

const { UserService } = require('./../services');
const passport = require('passport');
const validation = require('./../utils/middlewares/validationHandler');
const { BaseSchema, UserSchema } = require('./../utils/schemas');

require('./../utils/auth/strategies/jwt');

router.get(
  '/:_id/notes',
  validation({ _id: BaseSchema.id }, 'params'),
  validation(UserSchema.filterNoteQuery, 'query'),
  async function(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 0;
      const { _id } = req.params;
      const { noteName = 'created' } = req.query;

      const data = await UserService.getAllNotes({ _id, noteName, page });

      res.status(200).json({
        data,
        message: '¡Apuntes recuperados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/me', async function(req, res, next) {
  passport.authenticate('jwt', function(error, user) {
    try {
      if (error || !user) {
        next(boom.badRequest('¡Nombre de usuario o contraseña incorrecto!'));
      }

      return res.status(200).json({
        message: '¡Usuario obtenido!',
        data: user
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.get('/:username', async function(req, res, next) {
  try {
    const { username } = req.params;
    const data = await UserService.getOne({
      filter: { username },
      select: [
        '-password',
        '-favorites',
        '-saved',
        '-created',
        '-resetPasswordToken',
        '-resetPasswordExpires'
      ]
    });

    res.status(200).json({
      data,
      message: '¡Usuario obtenido!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
