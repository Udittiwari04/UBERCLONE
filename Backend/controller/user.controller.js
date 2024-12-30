// const userModel = require('../models/user.model')
// const userService = require('../services/user.services')
// const {validationResult} = require('express-validator')


// module.exports.registerUser = async (req,res,next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
    
//     const {fullname,email,password}= req.body;

//     console.log(req.body);

//     const hashedPassword = await userModel.hashedPassword(password);

//     const user = await userService.createUser({
//         firstname:fullname.firstname,
//         lastname:fullname.lastname,
//         email,
//         password:hashedPassword
//     })

//     const token = user.generateAuthToken();

//     res.status(200).json({token,user});
    
// }


const userModel = require('../models/user.model');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const blackListModel= require('../models/blacklistToken.model')

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        const isUserAlready = await userModel.findOne({ email });
        if (isUserAlready) {
            return res.status(400).json({ message: "User already exist with this email" });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
};

module.exports.loginUser = async(req,res,next)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({error:"Invalid email or password"});
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({error:"Invalid email or password"});
    }

    const token = user.generateAuthToken();

    res.cookie('token',token);

    res.status(200).json({token , user})


}


module.exports.getUserProfile = async(req,res,next)=>{
    return res.status(200).json(req.user)
}

module.exports.logoutUser = async(req,res,next)=>{
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListModel.create({ token});


   return res.status(200).json({message:"Logged out"
    })
}