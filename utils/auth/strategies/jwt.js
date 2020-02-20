const passport = require('passport');
const boom = require('@hapi/boom');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('../../../config');
const { UserService } = require('./../../../services');

passport.use(
  'jwt',
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (tokenPayload, cb) => {
      console.log('Hola')
      try {
        const filter = { username: tokenPayload.username };

        const user = await UserService.getOne({
          filter,
          select: [
            '-password',
            '-resetPasswordExpires',
            '-resetPasswordToken'
          ]
        });

        if (!user) {
          return cb(
            boom.unauthorized(
              '¡No estas autorizado para realizar esta acción!'
            ),
            false
          );
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
