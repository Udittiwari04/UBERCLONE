const express = require('express')
const router = express.Router();
const {body}  = require("express-validator")
const captainController = require('../controller/captain.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/register',[
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 character'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:8}).withMessage('Password must be at least 8 char'),
    body('vehicle.color').isLength({min:3}).withMessage('color must be at least 3 char'),
    body('vehicle.plate').isLength({min:3}).withMessage('plate must be at least  3 char'),
    body('vehicle.capacity').isInt({min:1}).withMessage('capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Invalid vehicleType')

],
captainController.registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:8}).withMessage('Password must be at least 8 char')
],
captainController.loginCaptain)


router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile);

router.get('/logout',authMiddleware.authCaptain,captainController.logoutCaptain);



module.exports = router;