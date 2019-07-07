const express = require('express');
const router = express();

const {} = require('./../services');

const validation = require('./../utils/middlewares/validationHandler');
const {} = require('./../utils/schemas/base');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get(
  '/',
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      // const postulants = await postulantService.getAll();

      res.status(200).json({
        // data: postulants,
        message: '¡Postulantes recuperados!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  // validation(createPostulantSchema),
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { body: data } = req;
      // const postulant = await postulantService.createOne({ data });

      res.status(201).json({
        // data: postulant,
        message: '¡Postulante creado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:_id/',
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      // const postulant = await postulantService.getOne({ _id });

      res.status(200).json({
        // data: postulant,
        message: '¡Postulante recuperado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/:_id/',
  // passport.authenticate('jwt', { session: false }),
  // validation(updatePostulantFavoriteSchema),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const { body: data } = req;
      // const postulant = await postulantService.updateFavorite({ _id, data });

      res.status(200).json({
        // data: postulant,
        message: '¡Postulante actualizado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:_id/',
  // passport.authenticate('jwt', { session: false }),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      // const postulant = await postulantService.deleteOne({ _id });

      res.status(200).json({
        // data: postulant,
        message: '¡Postulante eliminado!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
