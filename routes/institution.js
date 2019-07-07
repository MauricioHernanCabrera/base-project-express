const express = require('express');
const router = express();

const { InstitutionService } = require('./../services');
const institutionService = new InstitutionService();

const validation = require('./../utils/middlewares/validationHandler');
const {
  createInstitutionSchema,
  createSubjectSchema
} = require('./../utils/schemas/institution');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get('/', async function(req, res, next) {
  try {
    const data = await institutionService.getAll();

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
  validation(createInstitutionSchema),
  async function(req, res, next) {
    try {
      const data = await institutionService.createOne({
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

router.get('/:_id/subjects', async function(req, res, next) {
  try {
    const { _id } = req.params;
    const data = await institutionService.getSubjects({ _id });

    res.status(200).json({
      data,
      message: '¡Materias recuperadas!'
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:_id/subjects',
  passport.authenticate('jwt', { session: false }),
  validation(createSubjectSchema),
  async function(req, res, next) {
    try {
      const { _id } = req.params;
      const data = await institutionService.createSubject({
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
