module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.username == "noman"){
            return next();
        }else{
            return res.redirect('/');        
        }
        // console.log("Req Username " + req.username);
        // return next();
    }
    return res.redirect('/');
}