const mongoose=require("mongoose")

const coonectDB=async()=>{
    await mongoose.connect("mongodb+srv://atif001saleem_db:<paasword>@devtinder.z8nbxpy.mongodb.net/DevTinder"
    );
};

module.exports=coonectDB;

