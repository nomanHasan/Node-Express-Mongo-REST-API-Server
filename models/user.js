var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service');

var areaSchema = new Schema({
    district: { type: String },
    city: { type: String },
    thana: { type: String },
    zone: { type: String },
    address: { type: String },
    street: {type: String },
    house: { type: String },
});

var userSchema = new Schema({
    username: { type: String, unique: true, required: 'Username is required for any User'},
    name: {type: String, required: 'Name is Required for User'},
    password: {type: String, required: 'Password is Required for User'},
    accountType: {type: String, required: 'Account is Required for User'},
    contactNo: {type: String, require:"Your phone number is required " },
    email: {type: String },
    location: areaSchema
});

userSchema.statics.findUserByName = function(name, cb){
    return this.find({name: new RegExp(name, 'i'), cb});
}

userSchema.path('email').validate(function(value, next){
    userService.findUserByEmail(value, function(err, user){
        if(err){
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, 'Email Address already in Use');

userSchema.path('username').validate(function(value, next){
    userService.findUser(value, function(err, user){
        if(err){
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, 'Username already in Use');

var User = mongoose.model('User', userSchema);

module.exports = User ;

