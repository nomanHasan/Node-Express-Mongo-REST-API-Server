var express = require('express');
var router = express.Router();
var index = require('./api/index');
var users = require('./api/users');
var institution = require('./api/institution');
var jobs = require('./api/jobs');
var Accounts = require('./api/accounts');

var jwt = require('jsonwebtoken');

router.use('/users', users);

router.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'demoSecret', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;  
        next();
      }
    });
  } else {
    return res.send({ 
        success: false,
        message: 'No token provided.' 
    });
    
  }
});

router.use('/', index);
router.use('/institutions', institution);
router.use('/jobs', jobs);
router.use('/accounts', Accounts);

module.exports = router;
