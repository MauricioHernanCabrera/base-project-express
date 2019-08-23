const express = require('express');
const router = express();

const { InstitutionService } = require('./../services');

const validation = require('./../utils/middlewares/validationHandler');

const {
  InstitutionSchema,
  SubjectSchema,
  BaseSchema
} = require('./../utils/schemas');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get('/', async function(req, res, next) {
  try {
    const data = await InstitutionService.getAll();

    res.status(200).json({
      data,
      message: '¡Instituciones recuperadas!'
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validation(InstitutionSchema.createOne),
  async function(req, res, next) {
    try {
      const data = await InstitutionService.createOne({
        data: req.body
      });

      res.status(201).json({
        data,
        message: '¡Institucion creada!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:_id/subjects',
  validation({ _id: BaseSchema.id }, 'params'),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const data = await InstitutionService.getSubjects({ _id });

      res.status(200).json({
        data,
        message: '¡Materias recuperadas!'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:_id/subjects',
  passport.authenticate('jwt', { session: false }),
  validation({ _id: BaseSchema.id }, 'params'),
  validation(SubjectSchema.createOne),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const data = await InstitutionService.createSubject({
        data: req.body,
        _id
      });

      res.status(201).json({
        data,
        message: '¡Materia creada!'
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
