const express = require('express');
const router = express();

const { CodeYearService } = require('./../services');

router.get('/', async function(req, res, next) {
  try {
    const data = await CodeYearService.getAll();

    res.status(200).json({
      data,
      message: '¡Codigos de años recuperados!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
