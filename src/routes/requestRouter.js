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


//ReviewConnectionRequest API {accepted ,rejected}
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    //:requestId===Monngo Object id
    try{
        const loggedInUser=req.user;
        // validate the status
        const {status,requestId  }=req.params;

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not allowed"});

        }
        // atif send a request to abdul
        // fromUserId(atif)  to  toUserId(abdul)
        // abdul(toUserId) can accept it or reject it
        // so toUserId should be login so he can accepted or rejected

        //request id should be valid
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        });
        if(!connectionRequest){
            return res.status(400).json({message:"Connection request not found!"});           
        }     
        connectionRequest.status=status;

        const data=await connectionRequest.save();
        res.json({message:"Connection request "+status,data});


    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

})







module.exports=requestRouter;