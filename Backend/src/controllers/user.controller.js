import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import { User } from "../models/user.model.js";
import UploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/apiresponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {Router} from "express";
import jwt from "jsonwebtoken";

const generateaccessandrefreshtoken=async(userid)=>{
    try{
    const user=await User.findById(userid);
    const accestoken=user.generateaccesstoken();
    const refreshtoken=user.generateRefreshToken();
    user.refreshtoken=refreshtoken;
    await user.save({validateBeforeSave:false});
    return {accestoken,refreshtoken};
}
catch(error){
    throw new ApiError(500,"Something went wrong while generating refresh and access token");
}
}

const registeruser=asynchandler(async(req,res)=>{
    const {fullname,username,email,password,specilities,description}=req.body;
    if([fullname,email,password,username,specilities,description].some((field)=>{
        return(
        field?.trim()==="")
    })){
        throw new ApiError(400,"All fields are required");
    }
    if(password.length<8){
                throw new ApiError(400,"Password must be atleast 8 characters long");
    }
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if(!hasSpecialChar){
        throw new ApiError(400,"Password must have a special character");
    }
    const existuser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existuser){
        throw new ApiError(409,"User already exist");
    }
    let avatarlocalpath="";
    if(req.files && req.files.avatar && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
        avatarlocalpath=req.files.avatar[0].path;
    }
    const avatar=await UploadOnCloudinary(avatarlocalpath);
    const user=await User.create({
        fullname,email,password,specilities,description,username:username.toLowerCase(),avatar: avatar?.url||""
    })
    const createduser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createduser){
        throw new ApiError(500,"Something went wrong while signing up")
    }
    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered succesfully")
    )
})

const loginuser=asynchandler(async(req,res)=>{
    const {email,username,password}=req.body;
    if(!email && !username){
        throw new ApiError(400,"Username or Email is required")
    }
    const user=await User.findOne({
        $or:[{email},{username}]
    })
    if(!user){
        throw new ApiError(400,"User does not exist");
    }
    const correctpassword=await user.isPasswordCorrect(password);
    if(!correctpassword){
        throw new ApiError(401,"Incorrect password");
    }
    const {accestoken,refreshtoken}=await generateaccessandrefreshtoken(user._id);
    const loggedinuser=await User.findById(user._id).select("-password -refreshtoken");
    const option={
        httpOnly:true,
        secure:true
    }
    return res.status(200).cookie("accesstoken",accestoken,option).cookie("refreshtoken",refreshtoken,option)
    .json(
        new ApiResponse(200,{
                user:loggedinuser,
                accesstoken:accestoken,
                refreshtoken:refreshtoken
            },
        "User logged in succesfully")
    )
})

const logoutuser=asynchandler(async(req,res)=>{
await User.findByIdAndUpdate(
        
        req.user._id,
        {
            $unset:{
                refreshtoken: ""
            }
        },
            {
                new:true        
            }
    )

    const options={
            httpOnly:true,     
            secure:true
        }
        res.status(200).clearCookie("accesstoken",options).clearCookie("refreshtoken",options).json(new ApiResponse(200,{},"User logged out successfully"))
})


const refreshaccesstoken=asynchandler(async(req,res)=>{
    const incomingrefreshToken= req.cookies.refreshtoken || req.body.refreshtoken;
    if(!incomingrefreshToken){
        throw new ApiError(401,"Unauthorized request");
    }
    try {
        const decodedtoken=jwt.verify(
        incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user=await User.findById(decodedtoken?._id);
        if(!user){
            throw new ApiError(401,"Unauthorized request");
        }
        if(incomingrefreshToken!== user?.refreshtoken){
            throw new ApiError(401,"Invalid refresh token");
        }
        const options={
            httpOnly:true,
            secure:true
        }
    
       const{accesstoken,refreshtoken}=await generateaccessandrefreshtoken(user._id);
       return res.status(200).cookie("accessToken",accesstoken,options).cookie("refreshtoken",refreshtoken,options)
       .json(new ApiResponse(200,{accesstoken,refreshtoken},"Access Token refreshed"));
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token");
    }
})
const getcurrentuser=asynchandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current user fetched ssuccessfully"));
})

const editprofile=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    let {fullname,email,specilities,description,updateavatar,oldpassword,newpassword}=req.body;
    const olduser=await User.findById(userid);
    if(!fullname){
        fullname=olduser.fullname;
    }

    if(!email){
        email=olduser.email;
    }
    if(!specilities){
        specilities=olduser.specilities;
    }
    if(!description){
        description=olduser.description;
    }
    let url="";
    if(updateavatar){
    let avatarlocalpath="";
    
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
        avatarlocalpath=req.files.avatar[0].path;
        
    }
    // console.log(avatarlocalpath);
    
    const avatar=await UploadOnCloudinary(avatarlocalpath);
    url=avatar?.url||"";
    
}
if(!updateavatar){
    url=olduser.avatar;
}

let user=await User.findByIdAndUpdate(req.user?._id,{
    $set:{
        fullname,
        email,
        specilities,
        description,
        avatar:url
    }
},{new: true}).select("-password");
if(oldpassword && newpassword){
    if(newpassword.length<8){
        throw new ApiError(409,"Password length should be atleast 8 charachter");
    }
    // console.log(oldpassword);
    const correctpassword=await olduser.isPasswordCorrect(oldpassword);
    if(!(correctpassword)){
        throw new ApiError(400,"Wrong old password entered");
    }
    olduser.password=newpassword;
    // console.log(olduser.password);
    await olduser.save({validateBeforeSave:false});
}
    return res.status(200).json(new ApiResponse(200,user,"Success in changing user profile"));
})


export {registeruser,loginuser,logoutuser,refreshaccesstoken,getcurrentuser,editprofile};