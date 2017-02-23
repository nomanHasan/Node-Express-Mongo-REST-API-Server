var express = require('express');
var router = express.Router();
var userService = require('../../services/user-service');


var route = '/admin/students/';

router.get('/', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/students/all/1');
})


router.get('/all', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/students/all/1');
})

router.get('/all/:page', function(req, res, next){
    var page = req.params.page;
    page = Number(page);
    if(page <=0 )page=1;
    userService.getStudents(page, function (err, students) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        var vm = {
          title: "Students List",
          loggedUser: req.user,
          students: students.docs,
          pageCount: students.pages
        }
        console.log("SUCCESS");
        return res.render('students', vm);
    })
});

router.get('/details/:id', function(req, res, next){
    var id = req.params.id;
    userService.getStudentDetailsById(id, function (err, student) {
        if (err) {
            return res.json({ success: false, message: "An Error occured during getStudentDetailsById" });
        }
        var vm = {
        title: "Student",
        loggedUser: req.user,
        user: student
        }
        return res.render('user', vm);
    })
});

router.get('/edit/:id', function(req, res, next){
    var id = req.params.id;
    userService.getStudentDetailsById(id, function (err, student) {
        if (err) {
            return res.json({ success: false, message: "An Error occured during getStudentDetailsById" });
        }
        var vm = {
        title: "Edit Student",
        loggedUser: req.user,
        user: student
        }
        return res.render('user-edit', vm);
    })
});

router.post('/edit/:id', function(req, res, next){
    var id = req.params.id;
    userService.adminUpdateUser(id, req.body, function (err, user) {
        if (err) {
            return res.json({ success: false, message: "An Error occured during adminUpdateUser" });
        }
        return res.redirect(route+'details/'+id);
    })
});





module.exports = router;