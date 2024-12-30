const captainModel=require('../models/captain.model')
const captainServices = require('../services/captain.services')
const {validationResult} = require('express-validator')
const blackListModel = require('../models/blacklistToken.model')

module.exports.registerCaptain = async(req,res,next)=>{
  

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const {fullname,email,password,vehicle}=req.body;
  
  const isCaptainAlreadyExist = await captainModel.findOne({email});
  if(isCaptainAlreadyExist){
    return res.status(400).json({message:"Captain already exist with this email"})
    }
    const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainServices.createCaptain({
    firstname:fullname.firstname,
    lastname:fullname.lastname,
    email,
    password:hashedPassword,
    color:vehicle.color,
    plate:vehicle.plate,
    capacity:vehicle.capacity,
    vehicleType:vehicle.vehicleType
    
    
  })
  
  
  const token = captain.generateAuthToken();

  res.status(201).json({token,captain});
}

module.exports.loginCaptain = async(req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password}=req.body;

  const captain = await captainModel.findOne({email}).select('+password');
  if(!captain){
    return res.status(400).json({message:"Invalid email or password"})
  }
  ;
  const isValid = await captain.comparePassword(password);
  if(!isValid){
    return res.status(400).json({message:"Invalid email or password"})
  }

  const token = captain.generateAuthToken();

  res.cookie('token',token);
  res.status(200).json({token,captain});
}


module.exports.getCaptainProfile = async(req,res,next)=>{
  return res.status(200).json(req.captain)
}


module.exports.logoutCaptain = async(req,res,next)=>{
  
  const token = req.cookies.token || req.headers.authorization.split(' ')[1];

  await blackListModel.create({ token});
  res.clearCookie('token')

 return res.status(200).json({message:"Logged out"
  })
}