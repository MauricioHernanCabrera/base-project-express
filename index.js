const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('app:server');

const { initDB } = require('./utils/db');
const {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  notFound
} = require('./utils/middlewares/errorsHandlers');

const {
  AuthRouter,
  UserRouter
} = require('./routes');

// middleware
app.use(bodyParser.json({ limit: '500mb' }));


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
app.use('/auth', AuthRouter);
app.use('/users', UserRouter);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);

// not found
app.use(notFound);

(async function () {
  // database connect
  await initDB();

  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => debug(`Listening http://localhost:${server.address().port}`));
})();
