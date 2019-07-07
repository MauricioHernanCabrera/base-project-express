const passport = require('passport');
const boom = require('@hapi/boom');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('../../../config');
const { UserService } = require('./../../../services');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, cb) {
      const userService = new UserService();

      try {
        const filter = { username: tokenPayload.sub };
        const user = userService.getUser(filter);

        if (!user) {
          return cb(boom.unauthorized(), false);
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);
