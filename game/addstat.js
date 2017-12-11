var connection = require('./../config/database.js');

module.exports.add = function (req, res) {
    var id = req.body.id;
    connection.query('SELECT * FROM hero WHERE user = ?', [req.user.user_id], function (error, results, fields) {
        switch (id) {
            case "addmaxenergy":
                var maxenergy = results[0].maxenergy;
                var price = maxenergy * 5;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, maxenergy = maxenergy + 1, energy = energy + 1 WHERE user = ?', [price, req.user.user_id], function (error, results, fields) {
                        res.send({
                            id: "Energia",
                            amount: maxenergy + 1
                        });
                    });
                break;
            case "addmaxhp":
                var maxhp = results[0].maxhp;
                var price = maxhp * 2 - 10;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, maxhp = maxhp + 1, hp = hp + 1 WHERE user = ?', [price, req.user.user_id], function (error, results, fields) {
                        res.send({
                            id: "Zdrowie",
                            amount: maxhp + 1
                        });
                    });
                break;
            case "adddamage":
                var damage = results[0].damage;
                var price = damage * 3 + 25;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, damage = damage + 1 WHERE user = ?', [price, req.user.user_id], function (error, results, fields) {
                        res.send({
                            id: "Obrażenia",
                            amount: damage + 1
                        });
                    });
                break;
            case "addarmor":
                var armor = results[0].armor;
                var price = armor * 3 + 25;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, armor = armor + 1 WHERE user = ?', [price, req.user.user_id], function (error, results, fields) {
                        res.send({
                            id: "Pancerz",
                            amount: armor + 1
                        });
                    });
                break;
            case "addskill":
                var skill = results[0].skill;
                var price = skill * 3 + 25;
                if (results[0].gold >= price)
                    connection.query('UPDATE hero SET gold = gold - ?, skill = skill + 1 WHERE user = ?', [price, req.user.user_id], function (error, results, fields) {
                        res.send({
                            id: "Wyszkolenie",
                            amount: skill + 1
                        });
                    });
                break;
        }
    });
}
