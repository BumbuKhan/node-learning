var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function (req, res, next) {
    res.render('register', {title: 'Registration'});
});

router.post('/register', function (req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const db = require('../db.js');

    db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password], function (err, result, fields) {
        if (err) {
            throw err;
        }

        res.render('register', {title: 'Registration complete'})
    });
});

module.exports = router;
