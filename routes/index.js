var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Index route handled ');
  res.json({success:true, message: "This is the Index of the Site ", gohere:"admin"});
});
router.get('/*', function(req, res, next) {
  res.json({success:false, message: "This is the Unmatched Route Handler "});
});

module.exports = router;
