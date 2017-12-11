var connection = require('./../config/database.js');

module.exports.do = function (user, data, socket) {
    connection.query('SELECT energy, gold, points FROM hero WHERE user = ?', [user], function (error, results, fields) {
        var energy = results[0].energy;
        var gold = results[0].gold;
        var points = results[0].points;
        connection.query('SELECT * FROM job WHERE id = ?', [data], function (error, results, fields) {
            if (energy >= results[0].energy) {
                var success = Math.floor((Math.random() * 100) + 1) <= results[0].chance;

                if (!success) connection.query('UPDATE hero SET energy = energy - ? WHERE user = ?', [results[0].energy, user], function (error, results, fields) {
                    connection.query('SELECT energy FROM hero WHERE user = ?', [user], function (error, results, fields) {
                        socket.emit("fail", results[0].energy);
                    });
                });
                else {
                    var gold = results[0].gold + Math.floor(points * results[0].multipler);
                    connection.query('UPDATE hero SET energy = energy - ?, gold = gold + ? WHERE user = ?', [results[0].energy, gold, user], function (error, results, fields) {
                        connection.query('SELECT energy, gold FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            socket.emit("success", [results[0].energy, results[0].gold, gold]);
                        });
                    });
                }
            }
        });
    });
}
