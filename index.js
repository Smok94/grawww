var express = require('express');
var app = express();
var port = process.env.port || 3000;
var database = require('./config/database.js');
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var sessionStore = new MySQLStore({
    host: DB_HOST,
    port: 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});
app.use(session({
    secret: 'da82wkaek2',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
}))
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {
        database.query('SELECT id, password FROM user WHERE email = ?', [username], function (err, results, fields) {
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
var registration = require('./authentication/register.js');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
});

app.get('/', function (req, res) {
    res.render('home');
});

app.post('/register', registration.register);

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profil',
    failureRedirect: '/'
}));

app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
})

app.get('/profil', blockguest(), function (req, res) {
    res.render('profil');
});

function blockguest() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}

//wystartowanie serwera www
app.listen(port, function () {
    console.log('Aplikacja działa na porcie ' + port + '!');
});
