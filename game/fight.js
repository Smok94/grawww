var connection = require('./../config/database.js');

module.exports.begin = function (user, data, socket) {
    connection.query('SELECT * FROM hero WHERE user = ?', [user], function (error, results, fields) {
        var attacker = results[0];
        if (attacker.energy >= 10) {
            connection.query('SELECT * FROM hero WHERE name = ?', [data], function (error, results, fields) {
                var defender = results[0];
                if (defender.points < attacker.points + 50 && defender.points > attacker.points - 50) {
                    for (i = 0; i < 5; i++) {
                        defender.hp = SubZeroMin(defender.hp, CalcDamage(attacker, defender));
                        attacker.hp = SubZeroMin(attacker.hp, CalcDamage(defender, attacker));

                        if (defender.hp == 0 || attacker.hp == 0) break;
                    }
                    var a_points = attacker.points; //5 + Math.ceil((defender.points - attacker.points)/10);
                    var d_points = defender.points;
                    if ((defender.hp == 0 && attacker.hp == 0) || (defender.hp != 0 && attacker.hp != 0)) {
                        console.log(attacker.name + " atakuje " + defender.name + " i remisuje");
                        socket.emit("draw");
                    } else if (attacker.hp > 0) {
                        console.log(attacker.name + " atakuje " + defender.name + " i wygrywa");
                        a_points += 5 + Math.ceil((defender.points - attacker.points) / 10);
                        d_points = SubZeroMin(d_points, 5 + Math.ceil((defender.points - attacker.points) / 10));
                        connection.query('UPDATE hero SET gold = gold + ? WHERE user = ?', [defender.points * 10, user], function (error, results, fields) {});
                        socket.emit("win", [5 + Math.ceil((defender.points - attacker.points) / 10), defender.points * 10]);
                    } else {
                        console.log(attacker.name + " atakuje " + defender.name + " i przegrywa");
                        a_points = SubZeroMin(a_points, 5 - Math.ceil((defender.points - attacker.points) / 10));
                        d_points += 5 - Math.ceil((defender.points - attacker.points) / 10);
                        socket.emit("lose", 5 - Math.ceil((defender.points - attacker.points) / 10));
                    }
                    connection.query('UPDATE hero SET hp = ?, points = ?, energy = energy - 10 WHERE user = ?', [attacker.hp, a_points, user], function (error, results, fields) {
                        connection.query('SELECT * FROM hero WHERE user = ?', [user], function (error, results, fields) {
                            var attacker = results[0];
                            socket.emit("statusupdate", [attacker.points, attacker.energy, attacker.hp, attacker.gold]);
                        });
                    });
                    connection.query('UPDATE hero SET hp = ?, points = ? WHERE name = ?', [defender.hp, d_points, data], function (error, results, fields) {});
                }
            });
        } else socket.emit("noenergy");
    });
}

function SubZeroMin(a, b) {
    var res = a - b;
    if (res < 0) return 0;
    else return res;
}

function CalcDamage(source, target) {
    var crit_chance = source.skill - target.skill;
    var dodge_chance = target.skill * 2 - source.skill;
    var rand = Math.random() * 100 + 1;
    var dmg = SubZeroMin(source.damage, target.armor);
    if (dodge_chance >= rand) return 0;
    else if (crit_chance >= rand) return dmg * 2;
    else return dmg;
}
