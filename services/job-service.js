var Job = require('../models/job');
var User = require('../models/user');

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

exports.createJob = function(job, next){
    job.save(function(err){
        if(err){
            console.log("An Error Occured when saving to thr Database."+err);
            return next(err);
        }
        console.log('Job Saved on the Database');
        return next(null);
    });
}

exports.getJobs = function(ofs, next){

    Job.find({})
    .skip(ofs)
    .limit(10)
    .populate('creator', 'username')
    .exec(function(err, result){  
        next(err, result);
    });
}

exports.adminUpdateTuition = function(id, newJob, next){
    Job.findById(id, function(err, job){
        if(err){
            console.log(err);
            return next(err, null);
        }

        newJob.subjects.clean("");
        newJob.days.clean("");

        job.institution = newJob.institution;
        job.subjects = newJob.subjects;
        job.days = newJob.days;
        job.info.medium = newJob.medium;
        job.info.level = newJob.level;
        job.thana = newJob.thana;
        job.zone = newJob.zone;

        job.save(function(err, newJob){
            if(err){
                console.log(err);
                return next(err, null);
            }
            return next(null, newJob);
        })
    })
}

exports.getJobsPaginate = function(page, next){

    Job.paginate({}, {select: 'institution info.medium info.level zone creator', populate:{path:'creator', select:'username'}, page:page, limit:10}, function(err, results){
        if(err){
            console.log(err);
            return next(err, null);
        }
        console.log(results.docs[0].creator);
        next(null, results);
    });
}


exports.getPrivateJobs = function(query, next){

    Job.find(query, 'institution info.medium info.level days subjects', function(err, results){
        if(err){
            console.log(err);
            return next(err, null);
        }
        console.log(results);
        next(null, results);
    });
}



exports.getSelectedJobsPaginate = function(page, next){
    Job.paginate({selected: {$exists: true }}, {select: 'institution info.medium info.level zone creator', populate:{path:'creator', select:'username'}, page:page, limit:10}, function(err, results){
        if(err){
            console.log(err);
            return next(err, null);
        }
        console.log(results);
        next(null, results);
    })
}

exports.getAppliedJobsPaginate = function(page, next){
    Job.paginate({applicants: {$exists: true }}, {select: 'institution info.medium info.level zone creator', populate:{path:'creator', select:'username'}, page:page, limit:10}, function(err, results){
        if(err){
            console.log(err);
            return next(err, null);
        }
        console.log(results);
        next(null, results);
    })
}
exports.getActivatedJobsPaginate = function(page, next){
    Job.paginate({activated: {$exists: true }}, {select: 'institution info.medium info.level zone creator', populate:{path:'creator', select:'username'}, page:page, limit:10}, function(err, results){
        if(err){
            console.log(err);
            return next(err, null);
        }
        console.log(results);
        next(null, results);
    })
}


exports.jobCount = function(userid, next){
    Job.count({creator:userid}, function(err, count){
        if(err){
            console.log(err);
            return next(err, null);
        }
        return next(null, count);
    })
}

exports.getJobById = function(id, creator, next){
    console.log(creator);
    Job.findOne({ _id: id, creator: creator }).
    populate('applicants.applicant', 'teacherInfo _id: false').
    populate("selected.applicant", 'teacherInfo _id: false').
    exec(function(err, result){        
        console.log(result);
        next(err, result);
    })

    // Job.find({_id: id, creator: creator}, function(err, job){
    //     next(err, job);
    // })
}

exports.getJobDetailsById = function(id, next){
    Job.findOne({ _id: id }).
    populate('creator', 'username').
    populate('applicants.applicant', 'username teacherInfo').
    populate("selected.applicant", 'username teacherInfo').
    exec(function(err, result){
        next(err, result);
    })
}

exports.getPublicJobById = function(query, next){
    Job.findOne(query,'_id institution info.level info.medium subjects days thana zone', function(err, result){
        next(err, result);
    });
}

exports.getAppliedJobById = function(userId, jobId, next){
    Job.findOne({_id: jobId, "applicants.applicant": userId },'_id institution info.level info.medium subjects days thana zone applicants', function(err, result){
        next(err, result);
    });
}


exports.getPublicJobsPaginate = function(query, ofs, next){
    console.log(ofs);
    
    Job.find(query, '_id institution info.level info.medium subjects days thana zone', {skip: ofs, limit: 5}, function(err, jobs){
        next(err, jobs);
    });
}
exports.applyJob = function(jobId, userId, sal, next){
    console.log(userId, sal);
    var application = {
        salary: sal,
        applicant: userId, 
    }

    //Updating the Application Data in the Job Document

    Job.update({_id: jobId, 'applicants.applicant': {$ne: userId }}, {"$push": { "applicants" : application }}, {new: true}, function(err, job){
        if(err){
            console.log(err);
            return next(err);
        }

        var applied = {
            salary: sal,
            jobId: jobId 
        }

        //Updating the User Document with the Application

        User.update({_id: userId, 'applied.jobId':{$ne: jobId} }, {"$push": {"applied": applied }}, {new: true}, function(err, user){
            if(err){
                console.log(err);
                return next(err);
            }
            console.log("NOE RROR");
            console.log(job);
            console.log(user);
            return next(null);
        });
    });
}

exports.cancelApplication = function(userId, jobId, next){
    Job.update({_id: jobId}, {"$pull": {"applicants": {"applicant": userId } } }, {new: true}, function(err, job){
        if(err){
            console.log(err);
            return next(err);
        }
        User.update({_id: userId }, {"$pull": {"applied": {"jobId": jobId}}}, {new: true}, function(err, user){
            if(err){
                console.log(err);
                return next(err);
            }
            return next(null);
        })
    });
}

exports.getAppliedList = function(userId, next){
    User.find({_id: userId}, 'applied', function(err, user){
        if(err){
            console.log(err);
            return next(err);
        }
        console.log(user);
    });
}

exports.selectApplication = function(userId, jobId, applicants, next){
    Job.findOne({_id: jobId, creator: userId}, function(err, job){
        if(err){
            return next(err);
        }
        var applications = [];

        // console.log(applicants);
        // console.log(job.applicants);
        for(var i=0; i< job.applicants.length; i++){
            var id = String(job.applicants[i].applicant);
            var ind = applicants.indexOf(id);
            // console.log("Id of "+ id+ " is "+ ind);
            if( ind >= 0){
                // console.log("Matched " + job.applicants[i]);
                applications.push(job.applicants[i]);
            }
            // else{
            //     console.log("Not Matched"+ job.applicants[i]);
            // }
        }
        console.log(applications);
        var applicantIds = [];
        for(var i =0; i< applications.length; i++){
            applicantIds.push(applications[i].applicant);
        }

        console.log(applicantIds);
        console.log(applications);

        Job.update({_id: jobId }, {"selected": applications }, {new: true}, function(err, job){
            if(err){
                console.log(err);
                return next(err);
            }
            return next(null);
            // //Removing Applications from the Job Document
            // Job.update({_id: jobId}, {"$pull": {"applicants": { "$or": applications } } }, {new: true}, function(err, job){
            //     if(err){
            //         console.log(err);
            //         return next(err);
            //     }
            //     //Removing Applications from the Uesr Document
            //     User.update({_id: {"$in": applicantIds }}, {"$pull": {"applied": { "jobId": jobId } } }, {new: true}, function(err, job){
            //         if(err){
            //             console.log(err);
            //             return next(err);
            //         }
            //         return next(null);
            //     });
            // }); 
        });
        // Job.update({_id: jobId}, )
    });
}

exports.getPrivateJobsPaginate = function(query, ofs, next){
    console.log(ofs);
    
    Job.paginate(query, {offset: ofs, limit: 5}, function(err, result){        
        next(err, result);
    });
}