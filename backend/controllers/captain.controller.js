const CaptainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const BlacklistTokenModel = require("../models/blacklist.model");


const registerCaptain = async (req, res) => {   
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vehicle } = req.body;
    const isCaptainExists = await CaptainModel.findOne({ email });
    if (isCaptainExists) {
        return res.status(400).json({ message: "Captain already exists" });
    }   

      const hashedPassword=await CaptainModel.hashPassword(password);
   
        const captain = await captainService.createCaptain({    
       
            firstname:fullname.firstname,
            lastname:fullname.lastname,
        
        email,  
        password : hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
        });

     const token = captain.generateAuthToken();
     
     res.status(201).json({token,captain});  
}

const loginCaptain = async (req, res) => {
    const errors = validationResult(req);   
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }   
    const { email, password } = req.body;

    const captain = await CaptainModel
        .findOne({ email })
        .select("+password");

    if (!captain) {     
        return res.status(401).json({
            message: "Invalid Email or Password"
        });
    }       

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {     

        return res.status(401).json({
            message: "Invalid Email or Password"
        });
    }   

    const token = await captain.generateAuthToken();

    res.status(200).json({ token, captain });
}

const logoutCaptain = async (req, res) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await BlacklistTokenModel.create({ token });  
        res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
}   

const getCaptainProfile = async (req, res) => {
    const captain = req.captain;
    res.status(200).json({ captain });
}

module.exports = {  
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCaptainProfile
};

