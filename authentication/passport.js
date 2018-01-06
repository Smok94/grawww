var passport = require('passport');
var connection = require('./../config/database.js');
var bcrypt = require('bcrypt');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {
        connection.query('SELECT id, password FROM user WHERE email = ?', [username], function (err, results, fields) {
            if (err) {
                done(err);
            } else {
                if (results.length == 0) {
                    done(null, false);
                } else {
                    const hash = results[0].password.toString();

                    bcrypt.compare(password, hash, function (err, response) {
                        if (response) {
                            return done(null, {
                                user_id: results[0].id
                            });
                        } else {
                            return done(null, false);
                        }
                    })
                }
            }
        })
    }));

passport.use(new GoogleStrategy({
        clientID: "26484746672-66or3re070uhll9mg413bqhg4vh3bjnn.apps.googleusercontent.com",
        clientSecret: "Isi0GAzpmiFMsY4JKK-6tEdV",
        callbackURL: "/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        return done(null, {
            user_id: "g" + profile.id
        });
    }
));

module.exports = passport;
