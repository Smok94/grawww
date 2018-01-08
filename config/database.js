global.DB_HOST = 'sql11.freemysqlhosting.net';
global.DB_USER = 'sql11214724';
global.DB_PASSWORD = 'lM1s64lQtj';
global.DB_DATABASE = 'sql11214724';

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});
connection.connect(function (err) {
    if (!err) {
        console.log("Połączono z bazą danych");
    } else {
        console.log("Nie udało się połączyć z bazą danych");
    }
});
module.exports = connection;
