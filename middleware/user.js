const User = require('../models/user');
exports.userData = (req,res,next)=>{
    var userId =  "5e7f6a307cf4011ac821649c";
    User.findOne({_id:userId}).exec((err,result)=>{
        req.userData = result
        next();
    })
}