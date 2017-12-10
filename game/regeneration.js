var connection = require('./../config/database.js');

function engergyRegen() {
    connection.query('UPDATE hero SET energy = energy + 1 WHERE energy < maxenergy', null, function (error, results, fields) {})
}

setInterval(engergyRegen, 5000);
