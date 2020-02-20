require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  authAdminUsername: process.env.AUTH_ADMIN_USERNAME,
  authAdminPassword: process.env.AUTH_ADMIN_PASSWORD,
  authAdminEmail: process.env.AUTH_ADMIN_EMAIL,
  authJwtSecret: process.env.AUTH_JWT_SECRET,

  nodemailerEmail: process.env.NODEMAILER_EMAIL,
  nodemailerPassword: process.env.NODEMAILER_PASSWORD,
  dbHasAuth: Boolean(process.env.DB_HAS_AUTH),
  frontUrl: process.env.FRONT_URL
};


module.exports = { config };
