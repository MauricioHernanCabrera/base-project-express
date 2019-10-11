require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  // dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  authAdminUsername: process.env.AUTH_ADMIN_USERNAME,
  authAdminPassword: process.env.AUTH_ADMIN_PASSWORD,
  authAdminEmail: process.env.AUTH_ADMIN_EMAIL,
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  nodemailEmail: process.env.NODEMAIL_EMAIL,
  nodemailPassword: process.env.NODEMAIL_PASSWORD,

  // SOCIAL LOGIN
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,

  frontUrl: process.env.FRONT_URL
};

module.exports = { config };
