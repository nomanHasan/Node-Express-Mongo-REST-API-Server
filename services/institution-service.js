var Institution = require('../models/institution');

exports.addInstitution = function(inst, next){
    var institution = new Institution({
        name: inst.name,
        location: inst.location,
        shortName: inst.shortName
    })

    institution.save(function(err, inst){
        if(err){
            console.log('An Error Occured when Adding the Institution.')
            console.log(err);
            return next(err);
        }
        next(null);
        console.log('Institution Saved on the Database.');
    })
}

exports.findInstitutionOne = function(name, next){
    var regexp = new RegExp("^"+name, "i");
    Institution.findOne({name: regexp}, function(err, inst){
        next(err, inst);
    })
};

exports.findInstitutions = function(name, next){
    var regexp = new RegExp("^"+name, "i");
    Institution.find({name: regexp}, function(err, insts){
        next(err, insts);
    })
};

exports.getInstitutions = function(next){
    Institution.find(function(err, insts){
        next(err, insts);
    })
};