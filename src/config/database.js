const mongoose=require("mongoose")

const coonectDB=async()=>{
    await mongoose.connect("mongodb+srv://atif001saleem_db:Atif%408573975889@devtinder.z8nbxpy.mongodb.net/DevTinder"
    );
};

module.exports=coonectDB;

