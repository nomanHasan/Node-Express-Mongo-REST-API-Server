module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/admin/control-panel');
    }
    return next();
}