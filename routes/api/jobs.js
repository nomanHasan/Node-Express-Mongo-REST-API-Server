var express = require('express');
var router = express.Router();
var Job = require('../../models/job');
var jobService = require('../../services/job-service');
var userService = require('../../services/user-service');
var config = require('../../config');


router.get('/', function (req, res, next) {
    jobService.getJobs(function (err, jobs) {
        if (err) {
            console.log('An Error occured during getting jobList');
            res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        res.json(jobs);
    })
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
        jobService.getJobsPaginate({ creator: user._id }, Number(offset), function (err, jobs) {
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
    userService.getUserId(req.decoded.username, function (err, user) {
        jobService.getJobById(id, user._id, function (err, job) {
            if (err) {
                console.log('An Error occured during getting jobList');
                res.json({ success: false, message: "An Error occured during getting jobList" });
            }
            console.log(job);
            res.json({ success: true, job: job });
        });
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

router.post('/apply-tuition', function(req, res, next){
    console.log(req.body);
    console.log(req.body.offer);

    userService.getUserId(req.decoded.username, function(err, user){
        if(err){
            console.log(err);
            return res.json({ success:false, err:err });
        }
        jobService.applyJob(req.body.jobid, user._id, req.body.offer, function(err){
            if(err){
                return res.json({ success:false, err:err });
            }
            return res.json({ success:true });
        });
    });
});

module.exports = router;