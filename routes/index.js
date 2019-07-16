const authRouter = require('./auth');
const institutionRouter = require('./institution');
const codeNoteRouter = require('./codeNote');
const codeYearRouter = require('./codeYear');
const noteRouter = require('./note');
const userRouter = require('./user');

module.exports = {
  authRouter,
  institutionRouter,
  codeNoteRouter,
  codeYearRouter,
  noteRouter,
  userRouter
};
