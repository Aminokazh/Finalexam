const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
            try {
                // Find user by username (email)
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                // Compare password
                const isMatch = await bcryptjs.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                return done(null, user);  // Successful authentication
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
