const express = require('express');
const router = express();

const { UserService } = require('./../services');

const validation = require('./../utils/middlewares/validationHandler');
const { getNotesQuerySchema } = require('./../utils/schemas/user');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get(
  '/:_id/notes',
  validation(getNotesQuerySchema, 'query'),
  async function(req, res, next) {
    passport.authenticate('jwt', async function(error, user) {
      try {
        const page = parseInt(req.query.page) || 0;
        const { _id } = req.params;
        const { noteName = 'created' } = req.query;

        const notes = await UserService.getAllNotes({ _id, noteName, page });
        const data = { notes };

        if (notes.length == 20) data.nextPage = page + 1;

        res.status(200).json({
          data,
          message: '¡Apuntes recuperados!'
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  }
);

router.get('/:_id', async function(req, res, next) {
  try {
    const _id = req.params;
    const data = await UserService.getOne({
      filter: { _id },
      select: ['-password', '-favorites', '-saved', '-created']
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
