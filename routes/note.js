const express = require('express');
const router = express();

const { NoteService } = require('./../services');

const validation = require('./../utils/middlewares/validationHandler');
const {
  createNoteSchema,
  updateNoteSchema
} = require('./../utils/schemas/note');
const { idSchema } = require('./../utils/schemas/base');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get('/', async function(req, res, next) {
  passport.authenticate('jwt', async function(error, user) {
    try {
      const page = parseInt(req.params.page) || 0;
      const notes = await NoteService.getAll({ page, user });

      const data = { notes };

      if (notes.length) data.nextPage = page + 1;

      res.status(200).json({
        data,
        message: '¡Apuntes recuperados!'
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

router.post(
  '/',
  validation(createNoteSchema),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const data = await NoteService.createOne({
        data: {
          ...req.body,
          owner: req.user._id
        }
      });
      res.status(201).json({
        data,
        message: '¡Apunte creado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:_id', validation({ _id: idSchema }, 'params'), async function(
  req,
  res,
  next
) {
  passport.authenticate('jwt', async function(error, user) {
    try {
      const { _id } = req.params;
      const data = await NoteService.getOne({ _id, user });

      res.status(200).json({
        data,
        message: '¡Apunte recuperado!'
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

router.patch(
  '/:_id',
  passport.authenticate('jwt', { session: false }),
  validation({ _id: idSchema }, 'params'),
  validation(updateNoteSchema),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user, body: data } = req;

      await NoteService.updateOne({ _id, user, data });

      res.status(200).json({
        message: '¡Apunte actualizado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:_id',
  passport.authenticate('jwt', { session: false }),
  validation({ _id: idSchema }, 'params'),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.deleteOne({ _id, user });

      res.status(200).json({
        message: '¡Apunte eliminado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:_id/favorites',
  validation({ _id: idSchema }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.addFavorite({ _id, user });

      res.status(200).json({
        message: '¡Apunte agregado a tus favoritos!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:_id/favorites',
  validation({ _id: idSchema }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.removeFavorite({ _id, user });

      res.status(200).json({
        message: '¡Apunte removido de tus favoritos!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:_id/saved',
  validation({ _id: idSchema }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.addSaved({ _id, user });

      res.status(200).json({
        message: '¡Apunte agregado a tus guardados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:_id/saved',
  validation({ _id: idSchema }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.removeSaved({ _id, user });

      res.status(200).json({
        message: '¡Apunte removido de tus guardados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
