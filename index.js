var express = require('express');
var app = express();
var port = process.env.port || 3000;
var server = require("http").createServer(app);
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
var session = require('express-session')({
    secret: 'da82wkaek2',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
});
var MySQLStore = require('express-mysql-session')(require('express-session'));
var sessionStore = new MySQLStore({
    host: DB_HOST,
    port: 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});
app.use(session);
var passport = require('./authentication/passport.js');
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
});

var io = require("socket.io")(server);
var sharedsession = require("express-socket.io-session");
io.use(sharedsession(session, {
    autoSave: true
}));
io.of('/profil').use(sharedsession(session, {
    autoSave: true
}));

var iolisteners = require('./config/io.js');
iolisteners.getIO(io);
io.of('/profil').on("connection", iolisteners.profile);
io.of('/zajecia').on("connection", iolisteners.zajecia);

app.use(express.static(__dirname + '/public'));

app.use(require('./config/routes.js'));

require('./game/regeneration.js')(io);

//wystartowanie serwera www
server.listen(port, function () {
    console.log('Aplikacja działa na porcie ' + port + '!');
});
