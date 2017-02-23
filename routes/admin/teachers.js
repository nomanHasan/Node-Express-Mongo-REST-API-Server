var express = require('express');
var router = express.Router();
var userService = require('../../services/user-service');


router.get('/', function(req, res, next){
    console.log("redirect");
    res.redirect('/admin/teachers/1');
})

var route = "/admin/teachers/";

router.get('/:page', function(req, res, next){
    var page = req.params.page;
    console.log("Teachers List"+ page);
    page = Number(page);
    if(page <=0 )page=1;
    userService.getTeachers(page, function (err, teachers) {
        if (err) {
            console.log('An Error occured during getting jobList');
            return res.json({ success: false, message: "An Error occured during getting jobList" });
        }
        var vm = {
          title: "Teachers List",
          loggedUser: req.user,
          teachers: teachers.docs,
          pageCount: teachers.pages
        }
        console.log("SUCCESS");
        return res.render('teachers', vm);
    })
});

router.get('/details/:id', function(req, res, next){
    var id = req.params.id;
    userService.getTeacherDetailsById(id, function (err, teacher) {
        if (err) {
            return res.json({ success: false, message: "An Error occured during getTeacherDetailsById" });
        }
        var vm = {
        title: "Teacher",
        loggedUser: req.user,
        user: teacher
    }
        console.log("Teacher");
        console.log(teacher);
        return res.render('user', vm);
    })
});

router.get('/edit/:id', function(req, res, next){
    var id = req.params.id;
    userService.getTeacherDetailsById(id, function (err, teacher) {
        if (err) {
            return res.json({ success: false, message: "An Error occured during getTeacherDetailsById" });
        }
        var vm = {
        title: "Edit Teacher",
        loggedUser: req.user,
        user: teacher
        }
        return res.render('user-edit', vm);
    })
});

router.post('/edit/:id', function(req, res, next){
    var id = req.params.id;
    userService.adminUpdateUser(id, req.body, function (err) {
        if (err) {
            return res.json({ success: false, message: "An Error occured during adminUpdateUser" });
        }
        return res.redirect(route+'details/'+id);
    })
});



module.exports = router;