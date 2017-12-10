var express = require('express');
var router = express.Router();
var registration = require('./../authentication/register.js');
var passport = require('./../authentication/passport.js');
var herocreator = require('./../game/createhero.js')
var connection = require('./database.js');

router.get('/', function (req, res) {
    res.render('home');
});

router.post('/register', registration.register);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profil',
    failureRedirect: '/'
}));

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
});

router.get('/profil', blockguest(), function (req, res) {
    connection.query('SELECT id FROM user WHERE email = ?', ["2"], function (err, results, fields) {
        res.render('profil', {
            id: results[0].id
        });
    });
});

router.get('/herocreator', function (req, res) {
    if (req.isAuthenticated())
        connection.query('SELECT * FROM hero WHERE user = ?', [req.user.user_id], function (err, results, fields) {
            if (results.length > 0) res.redirect('/profil');
            else res.render('herocreator');
        });
    else res.redirect('/');
});

router.post('/createhero', herocreator.create);

function blockguest() {
    return (req, res, next) => {
        connection.query('SELECT * FROM hero WHERE user = ?', [req.user.user_id], function (err, results, fields) {
            if (req.isAuthenticated()) {
                if (results.length == 0) res.redirect('/herocreator');
                else return next();
            } else res.redirect('/');
        });
    }
}

module.exports = router;
