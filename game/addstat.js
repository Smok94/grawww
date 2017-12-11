var connection = require('./../config/database.js');

module.exports.add = function (user, data, socket) {
    connection.query('SELECT * FROM hero WHERE user = ?', [user], function (error, results, fields) {
        switch (data) {
            case "addmaxenergy":
                var maxenergy = results[0].maxenergy;
                var price = maxenergy * 5;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, maxenergy = maxenergy + 1, energy = energy + 1 WHERE user = ?', [price, user], function (error, results, fields) {
                        connection.query('SELECT energy, maxenergy FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            socket.emit("addmaxenergy", [results[0].energy, results[0].maxenergy]);
                        });
                    });
                break;
            case "addmaxhp":
                var maxhp = results[0].maxhp;
                var price = maxhp * 2 - 10;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, maxhp = maxhp + 1, hp = hp + 1 WHERE user = ?', [price, user], function (error, results, fields) {
                        connection.query('SELECT hp, maxhp FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            socket.emit("addmaxhp", [results[0].hp, results[0].maxhp]);
                        });
                    });
                break;
            case "adddamage":
                var damage = results[0].damage;
                var price = damage * 3 + 25;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, damage = damage + 1 WHERE user = ?', [price, user], function (error, results, fields) {
                        connection.query('SELECT damage FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            socket.emit("adddamage", results[0].damage);
                        });
                    });
                break;
            case "addarmor":
                var armor = results[0].armor;
                var price = armor * 3 + 25;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, armor = armor + 1 WHERE user = ?', [price, user], function (error, results, fields) {
                        connection.query('SELECT armor FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            socket.emit("addarmor", results[0].armor);
                        });
                    });
                break;
            case "addskill":
                var skill = results[0].skill;
                var price = skill * 3 + 25;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, skill = skill + 1 WHERE user = ?', [price, user], function (error, results, fields) {
                        connection.query('SELECT skill FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            socket.emit("addskill", results[0].skill);
                        });
                    });
                break;
        }
    });
}
