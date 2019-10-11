const express = require('express');
const router = express();
const validation = require('./../utils/middlewares/validationHandler');
const { createFile, authorize, getFolderApuntus } = require('./../utils/gapi');
const { NoteService } = require('./../services');
const { BaseSchema, NoteSchema } = require('./../utils/schemas');
const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get(
  '/',
  validation(NoteSchema.filterParams, 'query'), //prettier-ignore
  async function(req, res, next) {
    passport.authenticate('jwt', async function(error, user) {
      try {
        const page = parseInt(req.query.page) || 0;
        delete req.query.page;
        const filter = req.query;
        const data = await NoteService.getAll({ page, user, filter });

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

// router.post(
//   '/:_id/files',
//   // passport.authenticate('jwt', { session: false }),
//   async function(req, res, next) {
//     try {
//       const { _id } = req.params;
//       const { user } = req;
//       const file = req.files[0];

//       console.log(file);

//       const auth = authorize();
//       const folderApuntus = await getFolderApuntus({ auth });

//       const fileMetadata = {
//         name: file.originalname,
//         parents: [folderApuntus.id]
//       };
//       const media = {
//         mimeType: file.mimeType,
//         body: file
//       };

//       const resFile = await createFile({
//         auth,
//         config: {
//           resource: fileMetadata,
//           media
//         }
//       });

//       res.status(200).json({
//         data: resFile,
//         message: '¡Archivo agregado al apunte!'
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;
