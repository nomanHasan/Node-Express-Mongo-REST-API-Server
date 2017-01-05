var Job = require('../models/job');

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

exports.getJobs = function(next){
    Job.find({}, function(err, jobs){
        next(err, jobs);
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
    Job.findOne({ _id: id, creator: creator }, function(err, result){        
        next(err, result);
    })
}

exports.getPublicJobById = function(query, next){
    Job.findOne(query,'_id institution info.level info.medium subjects days thana zone', function(err, result){
        next(err, result);
    });
}

exports.getJobsPaginate = function(query, ofs, next){
    console.log(ofs);
    
    Job.paginate(query, {offset: ofs, limit: 5}, function(err, result){        
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
    Job.update({_id: jobId}, {$push: { 'applicants' :application }}, { upsert: true, safe: true}, function(err, job){
        if(err){
            console.log(err);
            return next(err);
        }
        console.log(job);
        return next(null);
    });
    
}

exports.getPrivateJobsPaginate = function(query, ofs, next){
    console.log(ofs);
    
    Job.paginate(query, {offset: ofs, limit: 5}, function(err, result){        
        next(err, result);
    })
}