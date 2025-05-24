import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import {project} from "../models/project.model.js";
import UploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/apiresponse.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import router from "../routes/user.routes.js"
// import {Router} from "express";
// import jwt from "JsonWebTokenError";

const createproject=asynchandler(async(req,res)=>{
    const {pjt_name,money,deswritten,complete_date}=req.body;
    // creator,bkphoto,descriptionlocalpath(file)
    if([pjt_name,money,deswritten,complete_date].some((field)=>{
            return(
            field?.trim()==="")
        })){
            throw new ApiError(400,"All fields are required");
        }
        let descriptionlocalpath="";
    if(req.files && req.files.description && Array.isArray(req.files.description) && req.files.description.length>0){
        descriptionlocalpath=req.files.description[0].path;
    }
    const description=await UploadOnCloudinary(descriptionlocalpath);

    let bkphotolocalpath="";
        if(req.files && req.files.bkphoto && Array.isArray(req.files.bkphoto) && req.files.bkphoto.length>0){
            bkphotolocalpath=req.files.bkphoto[0].path;
        }
        const bkphoto=await UploadOnCloudinary(bkphotolocalpath);

        const creatorid=req.user._id;
        if(!creatorid){
            throw error(500,"Cannot access creator id")
        }
        const Project=await project.create({
            pjt_name,money,deswritten,complete_date,bkphoto:bkphoto?.url || "",creator:creatorid,description:description?.url||""
        })
        if(!Project){
            throw new ApiError(500,"Something went wrong while creating new project");
        }
        return res.status(201).json(
        new ApiResponse(200, Project, "New project created succesfully")
    )
})


export {createproject};