const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../models/user.model');
const CaptainModel=require('../models/captain.model');
const BlacklistTokenModel=require('../models/blacklist.model'); 

const authenticateUser=async function(req,res,next){
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    const isBlacklisted = await BlacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized" });
    }   

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded._id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }

}

 const authenticateCaptain=async function(req,res,next){
    const token=req.headers.authorization?.split(' ')[1] || req.cookies.token; 
     
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await BlacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized" });
    }   
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.captain = await CaptainModel.findById(decoded._id);

        console.log('AUTH CAPTAIN:', req.captain);

        if (!req.captain) {
            return res.status(401).json({ message: "Captain not found" });
        }

        next();

    } catch (error) {
        console.log('CAPTAIN AUTH ERROR:', error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
}
module.exports = {
    authenticateUser,
    authenticateCaptain
};