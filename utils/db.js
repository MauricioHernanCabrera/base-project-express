const { config } = require('./config');
const mongoose = require('mongoose');

async function initDB() {
  const MONGO_URI = `mongodb://${config.dbHost}/${config.dbName}`;
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  });
}

module.exports = {
  initDB
};
