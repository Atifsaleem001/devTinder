const express=require("express");
const { userAuth } = require("../middlewares/auth.js");
const userRouter=express.Router();
const ConnectionRequest=require("../models/connectionRequest")

const USER_SAFE_DATA="firstName lastName age photoUrl gender about skills";
const User=require("../models/User.js");


//Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user;

        const connectionRequest= await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName lastName age photoUrl gender about skills");

        res.json({
            message:"Data fetched Successfully!",
            data:connectionRequest
        })

    }
    catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
});


//-GET all your connections info

// abdul => atif , atif accpected
// atif => assar , assr accpected
// so atif have two connetion 
// so for atif connection we have to check atif satisu where satust is accepted and atif either is fromuserid or touserid

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequest= await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ],
        }).populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);


        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
    }
    catch(err){
        res.status(400).send({message:err.message})
    }
});

//feed
userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        // User should see all the user cards except
        //1. his own card
        //2. his connection
        //3. ignored pepole
        //4. already sent the connections request

        const loggedInUser=req.user;

        // Paging
        const page=parseInt(req.query.page)|| 1;
        const limit=parseInt(req.query.limit)|| 10;
        limit=limit>25 ? 25:limit; // Error not define throw new error
        const skip=(page-1)*limit;


        // find all conections request user(sent+reveied)
        const connectionRequest= await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
        
        }).select("fromUserId toUserId");

        const hideUserFromFeed= new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}},
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);   
        res.send(users);

    }
    catch{
        res.status(400).send("ERROR:"+err.message);
    }
})





module.exports=userRouter;