const bcrypt=require("bcrypt");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");

const validator=require("validator");

const UserSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        maxLength:50,
        trim:true,
    },
    lastName:{
        type:String,
        trim:true,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address :" +value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword (value)){
                throw new Error("Enter a strong password :" +value);
            }
        },
        
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        required:true,
        enum:{
            values:["Male","Female","Other"],
            message:`{values} is not a valid gender type`
        }
        // validate(value){
        //     if(!["Male","Female","Other"].includes(value)){
        //         throw new Error("Gender data is not valid");
        //     }
        // },
    },
    photoUrl:{
        type:String,
        default:"https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL :" +value);
            }
        },

    },
    about:{
        type:String,
        default:"Connect with me!..",
        maxLength:200,

    },
    skills:{
        type:[String],
        validate(v) {
        if (v.length > 10) throw new Error("You can add max 10 skills");
        },
    }

},{timestamps:true});


UserSchema.methods.getJWT=async function () {

    const user=this;
    const  token=await jwt.sign({_id:user._id},"Dev@Tinder@8948",{expiresIn :"7d"});
    return token;
    
};

UserSchema.methods.validatePassword= async function (passwordInputByuser){
    const user=this;
    const passwordHash=user.password;

    const isPaaswordValid=await bcrypt.compare(passwordInputByuser,passwordHash);

    return isPaaswordValid;
};


const User=mongoose.model("User",UserSchema);
module.exports=User; 