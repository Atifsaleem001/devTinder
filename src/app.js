 const express=require("express")

 const app=express();


// app.use("/user",(req,res)=>{
//     res.send("if use will be on TOP No one will get chnace { writing order matters }")
// });
// this will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstName:"Atif", lastName:"Saleem"})
});


app.post("/user",(req,res)=>{
    console.log("Sving database");    
    res.send("Data base is Save ");
});


app.delete("/user",(req,res)=>{
    console.log("deleting user from  database");    
    res.send("deleting user completed ");
});

// this will match all the HTTP methd Api calls to/test
 app.use("/test",(req, res)=>{
    res.send("test from the Server!")
 });




app.listen(3000,()=>{
    console.log("server is listening on port 3000...");
    
 });
