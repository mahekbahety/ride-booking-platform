const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    



const captainSchema = new mongoose.Schema({
    fullname:{
        firstname: {
            type: String,
            required: true,
            minlength: [2, "First name must be at least 2 characters"],
        },
        lastname: {
            type: String,
            minlength: [2, "Last name must be at least 2 characters"],
        } 
    },     
        email: {
            type: String,
            required: true,     
            minlength: [5, "Email must be at least 5 characters"],
            unique: true,
        },  
        password: {
            type: String,
            required: true,     
            minlength: [6, "Password must be at least 6 characters"],
        },  

        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        socketId: {
            type: String,
        },
    
        
        vehicle: {
           color:{
                type: String,
                required: true,
                minlength: [3, "Color must be at least 3 characters"],
           },
           plate:{
                type: String,
                required: true,     
                minlength: [3, "Plate must be at least 3 characters"],
           },
           vehicleType:{
                type: String,
                required: true,
                enum: ['car', 'moto', 'auto'],
           },
           capacity:{
                type: Number,
                required: true,
                min: [1, "Capacity must be at least 1"],
           } ,
           location:{
                ltd: {
                    type:Number,
                   
                },      
                lng: {      
                    type:Number,    
                    

                }

    }
}

   })

   captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );  

    return token;
}       
    captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}           
 
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}       

   const CaptainModel = mongoose.model('captain', captainSchema);
   module.exports = CaptainModel;   