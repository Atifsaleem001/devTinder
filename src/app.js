const express=require("express")
const app=express();

const coonectDB= require("./config/database.js");

const User=require("./models/User.js")


app.post("/signup",async (req,res)=>{
    // creating a new instance of the User Model
    const user=new User({
        firstName:"Anash",
        lastName:"Saleem",
        emailId:"anash001saleem@gmail.com",
        password:"anash@8948",
        age:24,
        gender:"Male"
    });

    try{
        await user.save();
        res.send("User Added Succesfully...!")
    }catch(err){
        res.status(400).send('Error saving the user :'+err.message)
    }


});




coonectDB()
.then(()=>{
    console.log("Database Connection established....");
    app.listen(3000,()=>{
    console.log("server is listening on port 3000...");  
    });    
})
.catch((err)=>{
    console.error("Database can not be Connected !!");
});