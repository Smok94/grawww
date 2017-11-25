var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gra'
});
connection.connect(function (err) {
    if (!err) {
        console.log("Połączono z bazą danych");
    } else {
        console.log("Nie udało się połączyć z bazą danych");
    }
});
module.exports = connection;
