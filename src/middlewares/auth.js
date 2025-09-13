const jwt=require("jsonwebtoken");
const User=require("../models/User");


const userAuth= async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Token is not valid!!!");

        }
        const decodedmsg=await jwt.verify(token,"Dev@Tinder@8948");
        const {_id}=decodedmsg;

        const user=await User.findById(_id);

        if(!user){
            throw new Error("User not found");
        }
        req.user=user;
        next();

    }catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
};
module.exports={
    userAuth,
}


