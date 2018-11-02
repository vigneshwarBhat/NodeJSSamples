var express = require('express');
var passport = require('passport');
require('../Config/passport.js')(passport);
//var mongoose = require('mongoose');
//mongoose.Promise = require('bluebird');
var User = require('../Model/User.js');
var jwt = require('jsonwebtoken');
var config = require('../Config/dbConfig.js');
var router = new express.Router();
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        var newUser = new User(req.body);
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Username already exists.' });
            }
            res.json(newUser);
        });
    }
});

router.post('/signin', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;
        
        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});
//router.route('/').post(function (req, res) {
//    if (!req.body) {
//        res.status(400).send('Invalid request');
//    }
//    let salt = crypto.randomBytes(16).toString('base64');
//    let hash = crypto.createHmac('sha512', salt)
//                                    .update(req.body.password)
//                                    .digest("base64");
//    req.body.password = salt + "$" + hash;
//    req.body.permissionLevel = 1;
//    var user = new User(req.body);
//    user.save().then(function (user) {
//        //var token= jwt.sign({id:user._id}, config.secret, {expiresIn:86400} )
//        res.status(201).send(user);
//    }).catch(function (err) {
//        res.status(500).send('Internal Server Error');
//    })
//}).get(function (req, res) {
//    User.find({}).then(function (users) {
//        res.json(users);
//    }).catch(function (error) {
//        res.status(500).send(error);
//    })
//});
//router.route('/:userId').get(function (req, res) {
//    if (req.params.userId) {
//        User.findById(req.params.userId).then(function (user) {
//            user = user.toJSON();
//            delete user._id;
//            delete user.__v;
//            res.json(user);

//        }).catch(function (err) {
//            res.status(500).send(error);
//        })
//    }
//}).patch(function (req, res) {
//    if (req.params.userId) {
//        User.findById(req.params.userId).then(function (user) {
//            if (req.body.password) {
//                let salt = crypto.randomBytes(16).toString('base64');
//                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
//                req.body.password = salt + "$" + hash;
//            }
//            for (var b in req.body) {
//                user[b] = req.body[b];
//            }
//            user.save().then(function (user) {
//                res.json(user);
//            }).catch(function (err) {
//                res.status(500).send(error);
//            });
//        }).catch(function (err) {
//            res.status(500).send(error);
//        })
//    }

//}).delete(function (req, res) {
//    if (req.params.userId) {
//        User.findById(req.params.userId).then(function (user) {
//            user.remove().then(function () {
//                res.status(204).send("deleted");
//            }).catch(function (err) {
//                res.status(500).send(error);
//            })

//        })
//    }
//})
module.exports = router;