const express=require("express")
const app=express();

const coonectDB= require("./config/database.js");

const User=require("./models/User.js")

const {validateSignUpData}=require("./utils/validation.js");

const bcrypt=require("bcrypt");

// to conevert the js object form postman/ ui into json and then we save in db
app.use(express.json());

// signup API
app.post("/signup",async (req,res)=>{
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

// Get user by email API findOne
app.get("/User", async(req,res)=>{
    const userEmail=req.body.emailId;
    
    try{
        // .find returns a array obj [{}]
        // findone return only one obj
        const users= await User.findOne({emailId: userEmail})
        if(!users){
             res.status(404).send("User not found ");
        }
        else{
            res.send(users);
        }

        // if(users.length===0){
        //     res.status(404).send("User not found ");
        // }
        // else{
        //     res.send(users);
        // }
    }
    catch{
        res.status(400).send("something went wrong");
    }
});



// feed API -GET - gets ALL the users from the datsae 
app.get("/feed",async(req,res)=>{

    try{
        const AllUsers=await User.find({});
        res.send(AllUsers);
    }
    catch{
        res.status(400).send("Something went wrong");
    }

});

// delete API by ID
app.delete("/User",async (req,res)=>{
    const userid=req.body.userId; //_id
    try{
        //const user= await User.findByIdAndDelete({_id:userId})
        const user= await User.findByIdAndDelete(userid);
        res.send("User deleted Succesfully!!..")
    }
    catch{
         res.status(400).send("Something went wrong");
    }
});


// Update the user data of user by ID
app.patch("/User/:userId", async(req,res)=>{
    const userid=req.params?.userId;
    const data=req.body;
    try{
        const Allowed_Updates=["photoUrl","skills","about","age"];
        const isUpdateAllowed=Object.keys(data).every((k)=>{
           return Allowed_Updates.includes(k)
        });
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        await User.findByIdAndUpdate({_id:userid},data,{ runValidators: true, new: true });
        res.send(" User Updated successfully!!");
    }
    catch(err){
         res.status(400).send("UPDATE FAILED:"+err.message);
    }
});

// Udate the user data by email
// app.patch("/User", async(req,res)=>{
//     const emailid=req.body.emailId;
//     const data=req.body;
//     if(!emailid){
//         res.status(404).send("User not found ");
//     }
//     else{
//        try{
//         await User.findOneAndUpdate({emailId:emailid},data);
//         res.send(" User Updated successfully!!");
//     }
//     catch{
//         res.status(400).send("Something went wrong");
//     }
//     }
    
// });


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