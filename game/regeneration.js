var connection = require('./../config/database.js');

function engergyRegen(io) {
    connection.query('UPDATE hero SET energy = energy + 1 WHERE energy < maxenergy', null, function (error, results, fields) {
        for (var i in io.nsps['/profil'].connected) {
            var socket = io.nsps['/profil'].connected[i];
            if (socket.handshake.session.passport) {
                var id = socket.handshake.session.passport.user.user_id;
                connection.query('SELECT energy FROM hero WHERE user = ?', [id], function (error, results, fields) {
                    socket.emit("energyupdate", results[0].energy);
                });
            }
        }
        for (var i in io.nsps['/zajecia'].connected) {
            var socket = io.nsps['/zajecia'].connected[i];
            if (socket.handshake.session.passport) {
                var id = socket.handshake.session.passport.user.user_id;
                connection.query('SELECT energy FROM hero WHERE user = ?', [id], function (error, results, fields) {
                    socket.emit("energyupdate", results[0].energy);
                });
            }
        }
    });
}

module.exports = function (io) {
    setInterval(function () {
        engergyRegen(io);
    }, 5000);
}
