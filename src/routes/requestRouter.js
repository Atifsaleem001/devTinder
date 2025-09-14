const express=require("express");
const requestRouter=express.Router();

const{userAuth}=require("../middlewares/auth.js")

const ConnectionRequest=require("../models/connectionRequest.js");

const User=require("../models/User.js")
//sendConnectionRequest API {interested,ignored}
requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalid status type:"+status });
        }
        
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message:"User not found! ",
            });
        }




        // if there is an existing connection request
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            
            ]         
        });
        if(existingConnectionRequest){
            return res.status(400).send({message:"Connection Request Already Exists!!"})
        }


        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data= await connectionRequest.save();

        res.json({
            message:req.user.firstName+" "+status+" "+ toUser.firstName +" Profile",
            data,
        });

    }   
    catch(err){
        res.status(400).send("ERROR"+err.message)
    }



});

module.exports=requestRouter;