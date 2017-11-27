global.DB_HOST = 'localhost';
global.DB_USER = 'root';
global.DB_PASSWORD = '';
global.DB_DATABASE = 'gra';

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
