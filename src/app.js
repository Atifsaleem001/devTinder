const express=require("express")
const app=express();

const coonectDB= require("./config/database.js");

//cookie-parser
const cookieParser=require("cookie-parser");
//jsonwebtoken
// to conevert the js object form postman/ ui into json and then we save in db
app.use(express.json());
// cookie-parser middleware
app.use(cookieParser());


const authRouter=require("./routes/authRouter.js");
const profileRouter=require("./routes/profileRouter.js");
const requestRouter=require("./routes/requestRouter.js")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);









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