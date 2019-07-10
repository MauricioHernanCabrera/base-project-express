const express = require('express');
const router = express();

const { CodeNoteService } = require('./../services');

router.get('/', async function(req, res, next) {
  try {
    const data = await CodeNoteService.getAll();

    res.status(200).json({
      data,
      message: '¡Codigos de nota recuperados!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
