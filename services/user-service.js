var User = require('../models/user');

exports.addUser = function(user, next){
    var newUser = new User({
        username: user.username.toLowerCase(),
        name: user.name,
        password: user.password,
        email: user.email.toLowerCase(),
        contactNo: user.contactNo,
        accountType: user.accountType,
        location: user.location
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
            return next(err);
        }
        next(null);
        console.log('User Saved on the Database');
    });
}

exports.findAll = function(next){
    User.find({}, function(err, users){
        next(err, users);
    })
}

exports.getUserId = function(username, next){
    User.findOne({username: username},'_id location', function(err, user){
        next(err, user);
    });
}

exports.findUserByEmail = function(email, next){
    User.findOne({email: email.toLowerCase()}, function(err, user){
        next(err, user);
    })
};

exports.findUser = function(username, next){
    // console.log("Username: "+ username);
    User.findOne({username: username }, function(err, user){
        next(err, user);
    })
}

exports.checkUsername = function(username, next){
    // console.log("Username: "+ username);
    User.findOne({username: username },'username', function(err, user){
        console.log(user);
        next(err, user);
    });
}

exports.checkContactNo = function(cno, next){
    User.findOne({ contactNo: Number(cno) }, 'contactNo', function(err, user){
        console.log("There is the Probable Bug here in Contact No ");
        console.log(cno);
        console.log(user);
        next(err, user);
    });
}