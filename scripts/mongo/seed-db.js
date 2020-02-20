const { initDB } = require('./../../utils/db');


(async function () {
  try {
    await initDB();

  } catch (error) {
    console.log(error);
  } finally {
    return process.exit(0);
  }
})();
