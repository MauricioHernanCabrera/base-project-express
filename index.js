const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('app:server');

const boom = require('@hapi/boom');
const { initDB } = require('./utils/db');
const {
  logErrors,
  wrapErrors,
  clientErrorHandler
} = require('./utils/middlewares/errorsHandlers');

const { testRouter, authRouter } = require('./routes');

// middleware
app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, PUT, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  next();
});

// static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// routes
app.use('/test', testRouter);
app.use('/auth', authRouter);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);

// not found
app.use(function(req, res, next) {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  res.status(statusCode).json(payload);
});

(async function() {
  // database connect
  await initDB();
  // server
  const server = app.listen(8000, function() {
    debug(`Listening http://localhost:${server.address().port}`);
  });
})();
