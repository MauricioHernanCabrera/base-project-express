const { config } = require('./../config');
const mongoose = require('mongoose');

const initDB = () => {
  let mongoConfig = {}
  let mongoUri = ''

  if (config.dbHasAuth) {
    mongoUri = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin`; // prettier-ignore
    mongoConfig = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      authMechanism: 'SCRAM-SHA-256',
    }
  } else {
    mongoUri = `mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`; // prettier-ignore
    mongoConfig = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  }

  mongoose.set('useCreateIndex', true)
  return mongoose.connect(mongoUri, mongoConfig)
}

module.exports = {
  initDB
};
