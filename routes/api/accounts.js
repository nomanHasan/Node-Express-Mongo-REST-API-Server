var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var userService = require('../../services/user-service');
var config = require('../../config');


router.get('/user_info', function(req, res, next){
    console.log(req.decoded.username);

    User.findOne({username: req.decoded.username }, 'username name email contactNo accountType location', function(err, user){
        if(err){
            console.log(err);
            return res.json({ success:false, err:err });
        }
        return res.json({ success:true, user:user });
    });
});

router.post('/address', function(req, res, next){
    console.log("ADDRESS POST ");

    var location = {
        district: req.body.district,
        city: req.body.city,
        thana: req.body.thana,
        zone: req.body.zone,
        address: req.body.address,
        street: req.body.street,
        house: req.body.house
    }

    console.log(location);

    // var location = JSON.parse()

    User.update({username: req.decoded.username }, {location: location}, function(err, raw){
        if(err){
            console.log(err);
            return res.json({ success:false, err:err });
        }
        console.log(raw);
        return res.json({ success:true, location:location });
    });
});



// "$set":{
//     "location.$.district": location.district,
//     "location.$.city": location.city,
//     "location.$.thana": location.thana,
//     "location.$.zone": location.zone,
//     "location.$.address": location.address,
//     "location.$.street": location.street,
//     "location.$.house": location.house
// }    
// }

// '$set': { 
//         'district': req.body.district,
//         'city': req.body.city,
//         'thana': req.body.thana,
//         'zone': req.body.thana,
//         'address': req.body.address,
//         'street': req.body.street,
//         'house': req.body.house}}

module.exports = router;