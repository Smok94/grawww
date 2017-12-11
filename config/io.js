var addstat = require('./../game/addstat.js');
var io;

module.exports.getIO = function(io){
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
