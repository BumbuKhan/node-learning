var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home', {title: 'Home page'});
});

router.get('/register', function (req, res, next) {
    res.render('register', {title: 'Registration'});
});

router.post('/register', function (req, res, next) {

    // validation income data
    req.checkBody('username', 'Username field can not be empty').notEmpty();
    req.checkBody('username', 'Username length must be 4-15 chars in length').len(4, 15);
    req.checkBody('email', 'Incorrect email').isEmail();
    req.checkBody('email', 'Email field length should be 4-100').len(4, 100);
    req.checkBody('password', 'Password should contain at least lower case letter, upper case letter and special char').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password-repeat', 'Password should be at least 8 char long').len(8, 100);
    req.checkBody('password-repeat', 'Passwords do not mach').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        console.log(`Errors in form: ${JSON.stringify(errors)}`);

        res.render('register', {
            title: 'Registration failed, you have an errors',
            errors: errors
        })
    } else {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const db = require('../db.js');

        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                throw err
            }

            db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], function (err, result, fields) {
                if (err) {
                    throw err;
                }

                res.render('register', {title: 'Registration complete'})
            });
        });
    }
});

module.exports = router;
