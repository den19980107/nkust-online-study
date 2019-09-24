const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const config = require('../config/database');
const LoginHistory = require("../model/loginHistory");
const ActionType = require("../config/actionType");
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    //implement local strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        //match username
        let query = {
            username: username
        };
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: '找不到此使用者'
                });
            }

            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    const log = new LoginHistory({
                        userId:user._id,
                        action:ActionType.Login,
                        page:"/users/login"
                    });
                    log.save(function(err){
                        if(err){
                            console.log("save err")
                        }
                    })
                    
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: '密碼錯誤'
                    });
                }
            });

            // if (password == user.password) {
            //     return done(null, user);
            // } else {
            //     return done(null, false, {
            //         message: 'Wrong password'
            //     });
            // }
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}