var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var cors = require('cors');

var User = require('../models/user')
var SendMail = require('../models/sendMail')

/* GET users listing. */


router.get('/login', function (req, res, next) {
    req.logout()
    var local = res.locals.error
    var token = local.toString();
    var token = token.split(' ')
    // if(local.error.split(' ')[0]=="IncorrectUsername"||local.error.split(' ')[0]=="InvalidPassword"){
    // console.log(token[0]);
    if (token[0] == "IncorrectUsername" || token[0] == "InvalidPassword") {
        req.session.username = token[1];
        req.session.pass = token[2];
        let loginURL = '/login?';
        var searchParams = new URLSearchParams({ token: token[0] });
        loginURL += searchParams.toString();
        // console.log(loginURL);
        res.redirect(loginURL);
    }
    else if(local.toString() == "userBlocked"){
        let loginURL = '/login?';
        var searchParams = new URLSearchParams({ token: "userBlocked" });
        loginURL += searchParams.toString();
        res.redirect(loginURL);
    }
    else {
        var username = req.session.username, pass = req.session.pass;
        req.session.username = null
        req.session.pass = null
        res.render('beforeHome/login', { username: username, password: pass });
    }
});
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/home')
    }
);

/* GET users listing. */
router.get('/register', function (req, res, next) {
    req.logout()
    res.render('beforeHome/register', { errors: '' });
});
// Post Sign Up
router.post('/register',cors(), function (req, res, next) {
    console.log(req.body)
    // Parse Info
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var name = req.body.name
    // Validation
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('email', 'email is required').notEmpty()
    req.checkBody('name', 'name is required').notEmpty()
    var errors = req.validationErrors();
    if (errors) {
        res.render('beforeHome/register', { errors: errors })
    } else {
        //test 
        // 
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                User.getUserByEmail(email, function (err, user) {
                    if (err) throw err;
                    if (!user) {
                        //Create User
                        var newUser = new User({
                            username: username,
                            password: password,
                            email: email,
                            name: name,
                            // weaponLevel:0,
                            // armorLevel:0,
                            // EasyEmpire:{
                            //     HighestLevel:0
                            // }
                        })
                        User.createUser(newUser, function (err, user) {
                            if (err) throw err;
                        })
                        req.flash('success_msg', 'you are registered now log in')
                        // return res.redirect('/login')
                        return res.json({ responce: 'sucesss' });
                    }
                    else {
                        return res.json({ responce: 'failRepeatEmail' });
                    }
                })
            }
            else {
                return res.json({ responce: 'failRepeatName' });
            }
        })
        // res.redirect('/login')
    }
});
router.get('/forgetPass', function (req, res, next) {
    req.logout()
    res.render('beforeHome/forgetPass', { errors: '' });
})
router.post('/forgetPass', function (req, res, next) {
    // Parse Info
    var username = req.body.username
    var email = req.body.email
    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (user) {
            if (user.email != email) {
                return res.json({ responce: 'failuserisNotEmail' });
            }
            else {
                User.getUserByEmail(email, function (err, user) {
                    if (err) throw err;
                    if (user) {
                        //sendMail
                        var randPass = Math.random().toString(36) + Math.random().toString(36);//0.jh5mobu22br
                        var results = randPass.substring(3, 11);//0.jh5mobu22br
                        User.updatePassword(username, results, function (err, user) {
                            if (err) throw err;
                            if (user) {
                                User.givePassBcrypt(results, function (err, hash) {
                                    // console.log(hash);
                                    var url = req.body.homeUrl + "changePassword?token=";
                                    url += hash;
                                    var text = "你的密碼已被改為'" + results + "' 請利用這組密碼當成新密碼,並由\n";
                                    text += url + "\n去做修改密碼的工作";
                                    var mailOptions = {
                                        to: email,
                                        subject: '全速衝線-密碼確認信',
                                        text: text
                                    };
                                    var newOption = new SendMail.Options(mailOptions);
                                    // Validation
                                    SendMail.sendMail(newOption)
                                    req.session.updatePassKey = hash;
                                    // console.log(req.session.updatePassKey);

                                    return res.json({ responce: 'sucesss' });
                                });
                            }
                            else {
                                return res.json({ responce: 'fail' });
                            }
                        })
                    }
                    else {
                        return res.json({ responce: 'failEMailUndifine' });
                    }
                })
            }
        }
        else {
            return res.json({ responce: 'failNamUndifine' });
        }
    })
});

router.get('/changePassword', function (req, res, next) {
    console.log(req.query.token);
    if (req.query.token && req.session.updatePassKey == req.query.token) {
        res.render('beforeHome/changePassword');
    }
    else {
        res.redirect('/');
    }
})
router.post('/changePassword', function (req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var oldPassword = req.body.oldPassword
    // Validation
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('oldPassword', 'oldPassword is required').notEmpty()
    var errors = req.validationErrors();
    if (errors) {
        res.render('beforeHome/register', { errors: errors })
    } else {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (user) {
                User.comparePassword(oldPassword, user.password, function (err, isMatch) {
                    if (err) throw err
                    if (isMatch) {
                        req.flash('success_msg', 'you are updatePass now')
                        User.updatePassword(username, password, function (err, user) {
                            if (err) throw err;
                            // console.log("update :", user);
                        })
                        req.session.updatePassKey = null;
                        return res.json({ responce: 'sucesss' });
                    } else {
                        return res.json({ responce: 'failPassUndifine' });
                    }
                })
            }
            else {
                return res.json({ responce: 'failNamUndifine' });
            }
        })
        // res.redirect('/login')
    }
});


module.exports = router;


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                var script = 'IncorrectUsername ' + username + " " + password;
                return done(null, false, { message: script });
            }
            if(user.userstatus){
                if(user.userstatus==1){//被封鎖
                    var script = 'userBlocked';
                    return done(null, false, { message: script })
                } 
            }
            
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err
                if (isMatch) {
                    return done(null, user)
                } else {
                    var script = 'InvalidPassword ' + username + " " + password;
                    return done(null, false, { message: script })
                }
            })

        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});