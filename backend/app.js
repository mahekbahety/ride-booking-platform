const dotenv=require('dotenv');
dotenv.config();
const cookieParser=require('cookie-parser');
const express=require('express');
const app=express();
const cors=require('cors');
const connecttoDB=require('./database/database');
const userRoutes=require('./routes/user.routes');
const captainRoutes=require('./routes/captain.routes');
const mapRoutes=require('./routes/map.routes');
const rideRoutes=require('./routes/ride.routes');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));




connecttoDB();

app.use(cors());

app.get('/',(req,res)=>{
   res.send("hello");
})

app.use('/api/users', userRoutes);
app.use('/api/captains', captainRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/rides', rideRoutes);

module.exports=app;