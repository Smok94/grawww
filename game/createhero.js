var connection = require('./../config/database.js');

module.exports.create = function (req, res) {
    var nazwa = req.body.nazwa;

    connection.query('SELECT * FROM hero WHERE user = ?', [req.user.user_id], function (error, results, fields) {
        if (results == 0)
            connection.query('INSERT INTO hero (name, user) VALUES (?,?)', [nazwa, req.user.user_id], function (error, results, fields) {
                if (error) {
                    if (error) throw error;
                } else {
                    console.log('Stworzono postać ' + nazwa);
                    res.redirect('/profil');
                }
            });
        else res.redirect('/profil');
    });
}
