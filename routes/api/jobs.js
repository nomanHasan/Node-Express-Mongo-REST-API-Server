var express = require('express');
var router = express.Router();
var Job = require('../../models/job');
var jobService = require('../../services/job-service');
var userService = require('../../services/user-service');
var config = require('../../config');
var async = require('async');


router.get('/', function (req, res, next) {
    // jobService.getJobs(function (err, jobs) {
    //     if (err) {
    //         console.log('An Error occured during getting jobList');
    //         res.json({ success: false, message: "An Error occured during getting jobList" });
    //     }
    //     res.json(jobs);
    // })
});

router.post('/', function (req, res, next) {

    console.log(req.body.tuition);
    var tuition = JSON.parse(req.body.tuition);

    userService.getUserId(req.decoded.username, function (err, user) {
        if (err) {
            console.log(err);
            return res.json({ success: false, err: err });
        }
        jobService.jobCount(user._id, function (err, count) {
            if (err) {
                console.log(err);
                return res.json({ success: false, err: err });
            }
            if (count < 5) {                //IF Job count is less than 5
                var newJob = new Job({
                    institution: tuition.institution,
                    info: {
                        medium: tuition.medium,
                        level: tuition.level
                    },
                    subjects: tuition.subjects,
                    days: tuition.days,
                    thana: user.location.thana,
                    zone: user.location.zone,
                    creator: user._id,
                });
                jobService.createJob(newJob, function (err) {
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, message: "An Error occured when saving the Data." });
                    }
                    return res.json({ success: true, newJob: newJob });
                });
            } else {                      //If Job count is more or equal than 5 then
                console.log("Job count is more than 5");
                return res.json({ success: false, err: "Job count is more than 5", reachedLimit: true });
            }
        });
    });
});


router.get('/private/:offset', function (req, res, next) {
    var offset = req.params.offset;
    userService.getUserId(req.decoded.username, function (err, user) {
        jobService.getPrivateJobs({ creator: user._id }, function (err, jobs) {
            if (err) {
                console.log('An Error occured during getting jobList');
                res.json({ success: false, message: "An Error occured during getting jobList" });
            }
            res.json({ success: true, jobs: jobs });
        });
    });

});

router.get('/private-detail/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    jobService.getJobById(id, req.decoded._id, function (err, job) {
        if (err) {
            console.log('An Error occured during getting jobList');
            res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        console.log(job);
        res.json({ success: true, job: job });
    });
});


router.get('/public-detail/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id);
    jobService.getPublicJobById({_id: id}, function (err, job) {
        if (err) {
            console.log('An Error occured during getting jobList');
            res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        console.log(job);
        res.json({ success: true, job: job });
    });
});

router.get('/public/:offset', function (req, res, next) {
    var offset = req.params.offset;
    jobService.getPublicJobsPaginate({}, Number(offset), function (err, jobs) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        console.log(jobs);
        return res.json({ success: true, jobs: jobs });
    });
});

router.get('/applied/:offset', function (req, res, next) {
    var offset = req.params.offset;
    userService.getAppliedJobsList(req.decoded.username, function(err, user){
        if(err){
            console.log(err);
            return res.json({ success:false, err:err });
        }
        var jobs=[];
        console.log(user);
        callback = function(){
            console.log("Callback Function Called");
        }
        console.log("USER APPL");
        console.log(user[0].applied);
        // async.eachOf(user[0].applied, function(application, key, callback){
        //     // console.log("Application Salary");
        //     // console.log(application.salary);
            // jobService.getPublicJobById({_id: application.jobId}, function(err, job){
            //     job.sal= application.salary;
            //     console.log("JOB ");
            //     console.log(job);
            //     jobs.push(job);
            //     if(key >= user[0].applied.length-1){
            //         callback();
            //     }
            // });
        // }, function(err){
        //     if(err){
        //         console.log(err);
        //         return res.json({ success:false, err:err });
        //     }
        //     console.log("Success");
        //     return res.json({ success:true, jobs:jobs });
        // });

        var applied = user[0].applied;
        var count =applied.length;

        user[0].applied.forEach(function(application, index){
            jobService.getPublicJobById({_id: application.jobId}, function(err, job){
                job = job.toObject();               //Because Mongoose objects are immutable
                job.sal= Number(application.salary);
                console.log("JOB ");
                console.log(application.salary);
                jobs.push(job);
                console.log(job.sal);
                console.log(jobs);
                setTimeout(function(){
                    count --;
                    if(count ==0){
                        console.log("Timeout Function Called");
                        return res.json({ success:true, jobs:jobs });
                    }
                })
            });
        })

        //Mongoose Query Populate Solution
        // console.log(user);
        // return res.json({ success:false, jobs:user.applied });

    });
});

router.get('/applied-detail/:id', function (req, res, next) {
    var jobId = req.params.id;
    console.log(jobId);
    console.log(req.decoded._id);
    var userId = req.decoded._id;
    jobService.getAppliedJobById(userId, jobId, function(err, job){
        //If job is null
        if(job==null){
            return res.json({ success:false });
        }
        //Converting Mongoose object to mutable object
        job = job.toObject();
        if(err){
            console.log(err);
            return res.json({ success:false });
        }
        job.applicants.forEach(function(applicant){
            if(applicant.applicant == userId){
                job.sal = applicant.salary;
                job.applicants = null;
                return res.json({ success:true, job:job });
            }
        })
    })
});

router.post('/apply-tuition', function(req, res, next){
    console.log(req.body);
    console.log(req.body.offer);

    userService.getUserId(req.decoded.username, function(err, user){
        if(err){
            console.log(err);
            return res.json({ success:false, err:err });
        }
        jobService.applyJob(req.body.jobId, user._id, req.body.offer, function(err){
            if(err){
                return res.json({ success:false, err:err });
            }
            return res.json({ success:true });
        });
    });
});

router.get('/cancel-application/:id', function(req, res, next){
    var jobId = req.params.id;
    // console.log("Cancel Application");
    // console.log(jobId);
    jobService.cancelApplication(req.decoded._id, jobId, function(err){
        if(err){
            console.log(err);
            return res.json({ success:false, message: "Application Could not be canceled. " });
        }
        return res.json({ success:true, message:"Application Canceled. " });
    })
})

router.post('/select-tuition', function(req, res, next){
    var applicants = req.body.applicants;
    var tuition = req.body.tuition;

    applicants = JSON.parse(applicants);


    jobService.selectApplication(req.decoded._id, tuition, applicants, function(err){
        if(err){
            console.log(err);
            return res.json({ success:false });
        }
        return res.json({ success:true, message:"Application Slection complete. "});
    });

})

module.exports = router;