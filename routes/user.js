const express = require('express');
const router = express();

const { UserService } = require('./../services');

const validation = require('./../utils/middlewares/validationHandler');
const {} = require('./../utils/schemas/user');

const passport = require('passport');
require('./../utils/auth/strategies/jwt');

router.get('/:_id/notes', async function(req, res, next) {
  passport.authenticate('jwt', async function(error, user) {
    try {
      const { _id } = req.params;
      const data = await UserService.getAllNotes({ _id });

      res.status(200).json({
        data,
        message: '¡Apuntes recuperados!'
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

module.exports = router;
