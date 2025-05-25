import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userschema=new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,"Full Name is required"],
        trim:true
    },
    username:{
        type:String,
        required:[true,"A unique Username is required"],
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:[true,"Email id is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password should atleast be 8 characters long"],
        validate: {
    validator: function (val) {
      return /[!@#$%^&*(),.?":{}|<>]/.test(val);
    },
    message: "Password must contain at least one special character"
    }
},
    avatar:{
        type:String,
        default:""
    },
    refreshtoken:{
        type:String
    },
    specilities:{
        type:[String],
        default:[]
    },
    description:{
        type:String,
        default:"",
        maxlength: [1000,"Description exceeds the character limit of 1000"]
    },
    projectapplied:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"project"
    }],
    projectcreated:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"project"
    }],
    projectdone:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"project"
    }],
    avgrating:{
        type:Number,
        default:0,
        min:0,
        max:5
    }
},{timestamps:true});

userschema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,9);
    }
    next();
});


userschema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userschema.methods.generateaccesstoken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User",userschema);