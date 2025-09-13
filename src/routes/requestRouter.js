const express=require("express");
const requestRouter=express.Router();

const{userAuth}=require("../middlewares/auth.js")


//sendConnectionRequest API
requestRouter.post("/sendConnectionRequest", userAuth,(req,res)=>{
    
    const user=req.user;

    
    console.log("Sending a Connection request");

    
    res.send(user.firstName+" Sent the connection request!");
});

module.exports=requestRouter;