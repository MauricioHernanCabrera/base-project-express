const { initDB } = require('./../../utils/db');

(async function() {
  const conn = await initDB();
  await conn.connection.db.dropDatabase();
  return process.exit(0);
})();
