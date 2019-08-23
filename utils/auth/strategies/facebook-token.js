const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const { UserModel } = require('./../../../models');
const { config } = require('./../../../config');

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebookClientId,
      clientSecret: config.facebookClientSecret
    },
    function(accessToken, refreshToken, profile, done) {
      // UserModel.upsertFbUser(accessToken, refreshToken, profile, function(
      //   err,
      //   user
      // ) {
      //   return done(err, user);
      // });
      done(null, {});
    }
  )
);
