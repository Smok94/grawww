var addstat = require('./../game/addstat.js');
var job = require('./../game/job.js');
var fight = require('./../game/fight.js');
var io;

module.exports.getIO = function (io) {
    io = io;
}

module.exports.profile = function (socket) {
    if (socket.handshake.session.passport) {
        var user = socket.handshake.session.passport.user;
        socket.on("addstat", function (data) {
            addstat.add(user.user_id, data, socket);
        });
    }
};

module.exports.zajecia = function (socket) {
    if (socket.handshake.session.passport) {
        var user = socket.handshake.session.passport.user;
        socket.on("dojob", function (data) {
            job.do(user.user_id, data, socket);
        });
    }
};

module.exports.walka = function (socket) {
    if (socket.handshake.session.passport) {
        var user = socket.handshake.session.passport.user;
        socket.on("fight", function (data) {
            fight.begin(user.user_id, data, socket);
        });
    }
};
