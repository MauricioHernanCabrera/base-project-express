const boom = require('@hapi/boom');

function handleUniqueValidator(err, doc, next) {
  if (!err) return;
  if (!err.errors) return;

  Object.keys(err.errors).forEach(name => {
    next(boom.badRequest(err.errors[name]));
  });
}

module.exports = handleUniqueValidator;
