const User = require('../models/user');
exports.userData = (req,res,next)=>{
    var userId =  "5e821c86d99be04a67062704";
    User.findOne({_id:userId}).exec((err,result)=>{
        req.userData = result
        next();
    })
}

//