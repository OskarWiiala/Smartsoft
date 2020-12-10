// authentication features using passport

'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');

// local strategy for username and password login
passport.use(new Strategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        // result is binary row
        console.log('Local strategy', user);
        if (user === undefined) {
          return done(null, false, {message: 'Incorrect email.'});
        }

        // passwords don't match
        if (!bcrypt.compareSync(password, user.password)) {
          console.log('here');
          return done(null, false);
        }
        // use spread syntax to create shallow copy to get rid of binary row type
        return done(null, {...user}, {message: 'Logged In Successfully'});
      } catch (err) {
        return done(err);
      }
    }));

passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    },
    async (jwtPayload, done) => {
      // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        console.log('jwtPayload', jwtPayload)
        const user = await userModel.getUser(jwtPayload.user_id);
        if (user === undefined) {
          return done(null, false);
        }
        const plainUser = {...user};
        return done(null, plainUser);
      }
      catch (err) {
        return done(err);
      }
    },
));

module.exports = passport;