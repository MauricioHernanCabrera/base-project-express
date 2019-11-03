const { config } = require('./../config');
const mongoose = require('mongoose');

function initDB() {
  // const MONGO_URI = `mongodb://${config.dbHost}/${config.dbName}`;
  const MONGO_URI = config.dbHerokuDb
  
  mongoose.set('useCreateIndex', true);
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  });
}

module.exports = {
  initDB
};
