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
            // 確認是否 InActive
            if (user.InActive) {
                return done(null, false, {
                    message: '此為使用者目前無法登入，請洽管理員處理！'
                });
            }

            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    recordBehavior(user._id, ActionType.Login, "/users/login")

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

//紀錄行為
function recordBehavior(userId, action, detail) {
    let loginHistory = new LoginHistory();
    loginHistory.userId = userId;
    loginHistory.action = action;
    loginHistory.detail = detail;
    loginHistory.UTCDate = getUTCDate();
    loginHistory.date = getLocalDate();
    loginHistory.save(function (err) {
        if (err) {
            console.log(err)
        }
    })
}

function getLocalDate() {
    let localTime = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    return localTime
}
function getUTCDate() {
    return new Date();
}