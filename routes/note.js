const express = require('express');
const router = express();
const validation = require('./../utils/middlewares/validationHandler');
const { NoteService } = require('./../services');
const { BaseSchema, NoteSchema } = require('./../utils/schemas');
const passport = require('passport');
require('./../utils/auth/strategies/jwt');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public');
    },
    filename: function(req, file, cb) {
      const random = uuidv4();
      const random2 = uuidv4();
      const name = `${random2}-${req.user._id}-${random}-${file.originalname}`;
      cb(null, name);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 50
  }
});

router.get(
  '/',
  validation(NoteSchema.filterParams, 'query'), //prettier-ignore
  async function(req, res, next) {
    passport.authenticate('jwt', async function(error, user = {}) {
      try {
        const page = parseInt(req.query.page) || 0;

        const data = await NoteService.getAll({
          filter: { ...req.query, user },
          paginate: { page }
        });

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

router.post(
  '/',
  validation(NoteSchema.createOne),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const data = await NoteService.createOne({
        data: { ...req.body, owner: req.user._id }
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

router.get(
  '/:_id',
  validation({ _id: BaseSchema.id }, 'params'),
  async function(req, res, next) {
    passport.authenticate('jwt', async function(error, user) {
      try {
        const { _id } = req.params;
        const data = await NoteService.getOne({ filter: { _id, user } });

        res.status(200).json({
          data,
          message: '¡Apunte recuperado!'
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  }
);

router.patch(
  '/:_id',
  passport.authenticate('jwt', { session: false }),
  validation({ _id: BaseSchema.id }, 'params'),
  validation(NoteSchema.updateOne),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user, body: data } = req;

      await NoteService.updateOne({ filter: { _id, user }, data });

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
  validation({ _id: BaseSchema.id }, 'params'),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.deleteOne({ filter: { _id, user } });

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
  validation({ _id: BaseSchema.id }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.addFavorite({ filter: { _id, user } });

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
  validation({ _id: BaseSchema.id }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.removeFavorite({ filter: { _id, user } });

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
  validation({ _id: BaseSchema.id }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.addSaved({ filter: { _id, user } });

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
  validation({ _id: BaseSchema.id }, 'params'),
  passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      await NoteService.removeSaved({ filter: { _id, user } });

      res.status(200).json({
        message: '¡Apunte removido de tus guardados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:_id/files',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { user } = req;

      const data = await NoteService.addFile({
        filter: { _id, user },
        data: {
          file: req.file
        }
      });

      res.status(200).json({
        data,
        message: '¡Archivo agregado al apunte!'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:_id/files', async function(req, res, next) {
  try {
    const { _id } = req.params;

    const data = await NoteService.getTheListOfNoteFiles({
      filter: { _id }
    });

    res.status(200).json({
      data,
      message: '¡Archivos recuperados!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
