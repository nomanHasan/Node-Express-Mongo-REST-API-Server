var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');

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


module.exports = router;
