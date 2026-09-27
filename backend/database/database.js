const mongoose=require('mongoose');

function connecttoDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to db");
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports=connecttoDB;