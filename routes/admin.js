var express = require('express');
var router = express.Router();
var jobService = require('../services/job-service');

var config = require("../config");



//Restrictions
var passport = require("passport");
var restrict = require("../auth/restrict");
var restrictUser = require("../auth/restrictUser");
var adminRestrict = require('../auth/adminRestrict');
var adminRedirect = require('../auth/adminRedirect');


//Sub-Route handling Files
var tuitions = require('./admin/tuitions');
var teachers = require('./admin/teachers');
var students = require('./admin/students');


//Routing of Admins

router.get('/', adminRedirect, function(req, res, next) {
  var vm = {
    title: 'Login to your Account',
    error: req.flash('error')
  };
  res.render('login', vm);
});

router.post('/', adminRedirect,
function(req, res, next){
  if(req.body.rememberMe){
    req.session.cookie.maxAge = config.cookieMaxAge ;
  }
  next();
}, passport.authenticate('local',{
  successRedirect: '/admin/control-panel',
  failureRedirect: '/',
  failureFlash: 'Invalid Credential'
}));

router.get('/control-panel', restrict, function(req, res, next) {
  var vm = {
    title: 'Control Panel',
    loggedUser: req.user
  };
  res.render('control-panel', vm);
});

router.get('/error', restrict, function(req, res, next) {
  var vm = {
    title: 'Error',
    loggedUser: req.user,
    err: "ERROR OCCURED !"
  };
  res.render('error2', vm);
});



router.use('/tuitions', adminRestrict, tuitions);
router.use('/teachers', adminRestrict, teachers);

router.use('/students', adminRestrict, students);


router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})


module.exports = router;
