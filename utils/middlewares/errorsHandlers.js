const boom = require('@hapi/boom');
const debug = require('debug')('app:error');

const { config } = require('../../config');

const withErrorStack = (err, stack) => {
  if (config.dev) {
    return { ...err, stack }; // Object.assign({}, err, stack)
  } else {
    return { ...err };
  }
}

const logErrors = (err, req, res, next) => {
  console.log('log', err);
  next(err);
}

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

const clientErrorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload }
  } = err;

  res.status(statusCode).json(withErrorStack(payload, err.stack));
}

const notFound = (req, res, next) => {
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  res.status(statusCode).json(payload);
}


module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  notFound
};
