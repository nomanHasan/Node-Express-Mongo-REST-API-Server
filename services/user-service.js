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

exports.adminUpdateUser = function(id, newUser, next){
    if(newUser.accountType=='Teacher'){
        User.findOneAndUpdate({_id: id}, {$set: {
            name: newUser.name,
            username: newUser.username,
            accountType: newUser.accountType,
            contactNo: newUser.contactNo,
            email: newUser.email,
            "teacherInfo.institution": newUser.institution,
            "teacherInfo.level": newUser.level,
            "teacherInfo.sex": newUser.sex,
            "teacherInfo.age": newUser.age,
        }}, function(err){
            if(err){
                console.log(err);
                return next(err);
            }
            return next(null);
        });
    }else if(newUser.accountType=='Student'){
        User.findOneAndUpdate({_id: id}, {$set: {
            name: newUser.name,
            username: newUser.username,
            accountType: newUser.accountType,
            contactNo: newUser.contactNo,
            email: newUser.email,
            "location.district": newUser.district,
            "location.city": newUser.city,
            "location.thana": newUser.thana,
            "location.zone": newUser.zone,
            "location.address": newUser.address,
            "location.street": newUser.street,
            "location.house": newUser.house
        }}, function(err){
            if(err){
                console.log(err);
                return next(err);
            }
            return next(null);
        });
    }else {
        User.findOneAndUpdate({_id: id}, {$set: {
            name: newUser.name,
            username: newUser.username,
            accountType: newUser.accountType,
            contactNo: newUser.contactNo,
            email: newUser.email
        }}, function(err){
            if(err){
                console.log(err);
                return next(err);
            }
            return next(null);
        });
    }
    // return next(new Error("Account Type did not match"));
}

exports.findAll = function(next){
    User.find({}, function(err, users){
        next(err, users);
    })
}

exports.getTeachers = function(page, next){
    console.log("getTeachers");
    User.paginate({accountType:'Teacher'}, {select: 'username name email contactNo teacherInfo.institution', page: page, limit:10}, function(err, result){
        if(err){
            return next(err, null);
        }
        return next(err, result);
    });
}

exports.getTeacherDetailsById = function(id, next){
    User.findOne({ _id: id, accountType: 'Teacher'}).
    select({password: 0}).
    populate('applied.jobId', 'institution info.level info.medium thana').
    exec(function(err, result){
        console.log(result);
        next(err, result);
    })
}

exports.getStudentDetailsById = function(id, next){
    User.findOne({ _id: id, accountType: 'Student'}).
    select({password: 0}).
    exec(function(err, result){
        console.log(result);
        next(err, result);
    });
}

exports.getStudents = function(page, next){
    console.log("getStudents");
    User.paginate({accountType:'Student'}, {select: 'username name email contactNo location.thana', page: page, limit:10}, function(err, result){
        if(err){
            return next(err, null);
        }
        return next(err, result);
    });
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

exports.findUserByUsername = function(username, next){
    User.find({username: username }, function(err, user){
        next(err, user);
    })
}

exports.getAppliedJobsList = function(username, next){
    User.find({username: username }, 'applied', function(err, user){
        next(err, user);
    })
}

exports.getAppliedJobsList_Populate = function(username, next){
    User.find({username: username }).populate('applied.job').exec(function(err, user){
        next(err, user);
    });
}

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