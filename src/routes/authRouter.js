const express=require("express");
const authRouter=express.Router();

const {validateSignUpData}=require("../utils/validation.js");
const User=require("../models/User.js")
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
authRouter.use(cookieParser());
authRouter.use(express.json());


// signup API
authRouter.post("/signup",async (req,res)=>{
    try{
        //validation of data 
        validateSignUpData(req);

        //Encrypt the password
        const {firstName,lastName,emailId,password,gender}=req.body;
        const passwordHash= await bcrypt.hash(password,10);
        
        // creating a new instance of the User Model
        const user=new User({firstName,
            lastName,
            password :passwordHash,
            emailId,
            gender});

        await user.save();
        res.send("User Added Succesfully...!")
    }catch(err){
        res.status(400).send('ERROR :'+err.message)
    }
});


// Login API
authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;

        // validation if email exixts
        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Error ("Invalid Credentials!");
        }
        // now checking the password with encrypted password
        const isPaaswordValid =await user.validatePassword(password)// return bool

        if(isPaaswordValid){

            //Create a JWT Token
            const token =await user.getJWT();
            //ADD the token to cookie and send the resopnse back to user
            res.cookie("token",token,{
                httpOnly: true,
                secure: true, 
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
            });

            res.send("Login Successful!!");
        }
        else{
            throw new Error("Invalid Credentials!");
        }
    
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
});



module.exports=authRouter;