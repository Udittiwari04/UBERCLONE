const userModel = require('../models/user.model')
const captainModel = require('../models/captain.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistTokenModel= require('../models/blacklistToken.model');

module.exports.authUser = async(req,res,next)=>{

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    
    const isBlackListed = await userModel.findOne({token: token})
    if(isBlackListed){
       return res.status(401).json({message:'Unauthorised'})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        const user = await userModel.findById(decoded._id);
        console.log(user)
        req.user = user;
        return next();
    }catch{
        res.status(401).json({message:"Unauthorized"});
    }
}

module.exports.authCaptain = async(req,res,next)=>{

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    
    const isBlackListed = await BlacklistTokenModel.findOne({token: token})
    if(isBlackListed){
       return res.status(401).json({message:'Unauthorised'})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    }catch{
        res.status(401).json({message:"Unauthorized"});
    }
}