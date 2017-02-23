var express = require('express');
var router = express.Router();
var jobService = require('../../services/job-service');


router.get('/', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/tuitions/all/1');
})

router.get('/all', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/tuitions/all/1');
})


router.get('/all/:page', function(req, res, next){
    var page = req.params.page;
    console.log("Tuition List");
    page = Number(page);
    if(page <=0 )page=1;
    jobService.getJobsPaginate(page, function (err, jobs) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        var vm = {
          title: "Tuition List",
          loggedUser: req.user,
          jobs: jobs.docs,
          pageCount: jobs.pages
        }
        return res.render('jobs', vm);
    })
});


router.get('/selected', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/tuitions/selected/1');
})
router.get('/selected/:page', function(req, res, next){
    var page = req.params.page;
    console.log("Selection Tuition List");
    page = Number(page);
    if(page <=0 )page=1;
    jobService.getSelectedJobsPaginate(page, function (err, jobs) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        var vm = {
          title: "Selected Tuition List",
          loggedUser: req.user,
          jobs: jobs.docs,
          pageCount: jobs.pages
        }
        return res.render('jobs', vm);
    })
})

router.get('/applied', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/tuitions/applied/1');
})
router.get('/applied/:page', function(req, res, next){
    var page = req.params.page;
    console.log("Applied Tuition List");
    page = Number(page);
    if(page <=0 )page=1;
    jobService.getAppliedJobsPaginate(page, function (err, jobs) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        var vm = {
          title: "Selected Tuition List",
          loggedUser: req.user,
          jobs: jobs.docs,
          pageCount: jobs.pages
        }
        return res.render('jobs', vm);
    })
})

router.get('/activated', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/tuitions/activated/1');
})
router.get('/activated/:page', function(req, res, next){
    var page = req.params.page;
    console.log("Activated Tuition List");
    page = Number(page);
    if(page <=0 )page=1;
    jobService.getActivatedJobsPaginate(page, function (err, jobs) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        var vm = {
          title: "Selected Tuition List",
          loggedUser: req.user,
          jobs: jobs.docs,
          pageCount: jobs.pages
        }
        return res.render('jobs', vm);
    })
})
router.get('/details/:id', function(req, res, next){
    var id = req.params.id;
    console.log("Tuition Details"); 
    jobService.getJobDetailsById(id, function (err, job) {
        if (err) {
            console.log('An Error occured during getting Job Details');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        console.log(job);
        var vm = {
          title: "Tuition Details",
          loggedUser: req.user,
          job: job
        }
        return res.render('job', vm);
    })
});

router.get('/edit/:id', function(req, res, next){
    var id = req.params.id;
    console.log("Edit Tuition"); 
    jobService.getJobDetailsById(id, function (err, job) {
        if (err) {
            console.log('An Error occured during Editing Tuition');
            return res.json({ success: false, message: "An Error occured during editing Tuition" });
        }
        console.log(job);
        var vm = {
          title: "Edit Tuition",
          loggedUser: req.user,
          job: job
        }
        return res.render('job-edit', vm);
    });
});

router.post('/edit/:id', function(req, res, next){
    var id = req.params.id;
    console.log("Edit Tuition POST"); 
    console.log(req.body);
    jobService.adminUpdateTuition(id, req.body, function(err, result){
        if(err){
            console.log(err);
            return res.render('error2', err);
        }
        console.log(result);
        return res.redirect('/admin/tuitions/details/'+id);
    })
});

module.exports = router;