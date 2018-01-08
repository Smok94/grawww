var connection = require('./../config/database.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.register = function (req, res) {
    var today = new Date();
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var created_at = today;

    if (password == repassword && password.length > 4 && email.length > 6) {
        connection.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
            if (results.length == 0) {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    connection.query('INSERT INTO user (email, password, registred) VALUES (?,?,?)', [email, hash, created_at], function (error, results, fields) {
                        if (error) {
                            if (error) throw error;
                        } else {
                            console.log('Zarejestrowano użytkownika ' + email);
                            connection.query('SELECT LAST_INSERT_ID() as user_id', function (error, results, fields) {
                                if (error) throw error;
                                req.login(results[0], function (err) {
                                    res.redirect('/herocreator');
                                })
                            })
                        }
                    });
                })
            } else res.redirect('/');
        })
    } else res.redirect('/');
}
