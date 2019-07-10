const authRouter = require('./auth');
const institutionRouter = require('./institution');
const codeNoteRouter = require('./codeNote');
const codeYearRouter = require('./codeYear');
const noteRouter = require('./note');

module.exports = {
  authRouter,
  institutionRouter,
  codeNoteRouter,
  codeYearRouter,
  noteRouter
};
