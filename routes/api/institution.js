var express = require('express');
var router = express.Router();
var Institution = require('../../models/institution');
var institutionService = require('../../services/institution-service');

router.get('/', function(req, res, next){
    institutionService.getInstitutions(function(err, insts){
        res.json(insts);
    });
})

router.post('/', function(req, res, next){
    var inst = new Institution({
        name: req.body.name,
        location: req.body.location,
        shortName: req.body.shortName
    });

    if( !(req.body.name && req.body.location && req.body.shortName) ){
        res.json({success:false, message: "Post request Body was empty"});
    }

    institutionService.addInstitution(inst, function(err){
        if(err){
            console.log("Institution Adding was Unsuccessful. ");
            res.json({success:false, message: "Error Occured"});
        }
        res.json({success: true, institution: inst});
    });
})

module.exports = router;