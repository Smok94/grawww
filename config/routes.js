var express = require('express');
var router = express.Router();
var registration = require('./../authentication/register.js');
var passport = require('./../authentication/passport.js');

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
})

router.get('/profil', blockguest(), function (req, res) {
    res.render('profil');
});

function blockguest() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

module.exports = router;
