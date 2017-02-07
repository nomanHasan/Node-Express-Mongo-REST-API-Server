var express = require('express');
var router = express.Router();
var userService = require('../../services/user-service');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  userService.findAll(function(err, users){
    if(err){
      console.log(err);
      res.json(err);
    }
    res.json(users);
  })
});


router.get('/username/:usrname', function(req, res, next){
  var username  = req.params.usrname;
  userService.checkUsername(username, function(err, user){
    if(err){
      console.log('Error Occured ');
      res.json({success:false, err:err});
    }
    if(!user){
      return res.json({success:true, exists:false, username: username});
    }
    return res.json({success:true, exists:true, username: username});
  });
});

router.get('/contactno/:contactno', function(req, res, next){
  var contactNo  = req.params.contactno;

  userService.checkContactNo(contactNo, function(err, user){
    if(err){
      console.log('Error Occured ');
      res.json({success:false, err:err});
    }
    if(!user){
      return res.json({success:true, exists:false, contactNo: contactNo});
    }
    return res.json({success:true, exists:true, contactNo: contactNo});
  });
});

router.post('/create', function(req, res, next) {
  var user = {
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    contactNo: req.body.contactNo,
    accountType: req.body.accountType,
    location: {
      district: "",
      city: "",
      thana: "",
      zone: "",
      address: "",
      street: "",
      house: ""
    },
    teacherInfo: {
      institution: "",
      level: "",
      sex: "",
      age: 0,
    }
  }
  console.log(user);
  userService.addUser(user, function(err){
    if(err){
        console.log("Error Occured"+ err);
        res.json({ success:false, err:err });
      }
      res.json({ success:true, user:user });
    });  
});


router.post('/authenticate', function(req, res, next) {
  userService.findUser(req.body.username, function(err, user){
    if(err){
      console.log("Some Error Occured during Authentication")
      res.json({ success:false, Error: "Some Error Occured during Authentication"});
    }
    if(!user){
      console.log('There was no user by the username ');
      res.json({ success:false, Error: "There was no User by that name"});
    }
    else if(user.password != req.body.password){
      res.json({success:false, Error: "The password does not match "});
    }
    else {
      // The User is AITHENTICATED !
      var payload = {
        _id: user._id,
        username: user.username,
        accountType: user.accountType
      }

      var returnUser = {
        _id: user._id,
        username: user.username,
        accountType: user.accountType,
        location: user.location,
        email: user.email,
        contactNo: user.contactNo,
        name: user.name,
        teacherInfo: user.teacherInfo
      }

      var token = jwt.sign(payload, 'demoSecret', {
          expiresIn: 1440*60*7 // expires in 24 hours X 7
        });
      res.json({
        success:true,
        message:"Authentication Successfull. ",
        user: returnUser,
        token: token
      });
    }
 })
  // res.json({demo:"Demo", unam: req.body.username, pad: req.body.password});
});


module.exports = router;
