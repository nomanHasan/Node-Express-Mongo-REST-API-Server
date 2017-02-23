module.exports = function(){
    var passport = require('passport');
    var passportLocal = require('passport-local');
    var userService = require('../services/user-service');

    passport.use(new passportLocal.Strategy(function(username, password, next){
        console.log('Finding The User by the Username ');
        userService.findUser(username, function(err, user){
            if(err){
                return next(err);
            }
            if(!user){
                console.log('There was no user by the username ');
                return next(null, null);
            }
            if(user.password != password){
                console.log('Password did not match');
                return next(null, null);
            }
            console.log('User is Authenticated');
            console.log(user.firstName);
             next(null, user);
        });
    }));

    passport.serializeUser(function(user, next){
        next(null, user.username);
    });

    passport.deserializeUser(function(username, next){
        userService.findUser(username, function(err, user){
            next(err, user);
        });
    });
}