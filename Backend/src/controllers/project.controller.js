import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import {project} from "../models/project.model.js";
import {User} from "../models/user.model.js";
import UploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/apiresponse.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import router from "../routes/user.routes.js"
// import {Router} from "express";
// import jwt from "JsonWebTokenError";

const createproject=asynchandler(async(req,res)=>{
    const {pjt_name,money,deswritten,complete_date,specilities}=req.body;
    // creator,bkphoto,descriptionlocalpath(file)
    if([pjt_name,deswritten].some((field)=>{
            return(
            field?.trim()==="")
        })){
            throw new ApiError(400,"All fields are required");
        }
        let descriptionlocalpath="";
    if(req.files && req.files.description && Array.isArray(req.files.description) && req.files.description.length>0){
        descriptionlocalpath=req.files.description[0].path;
    }
    

    let bkphotolocalpath="";
        if(req.files && req.files.bkphoto && Array.isArray(req.files.bkphoto) && req.files.bkphoto.length>0){
            bkphotolocalpath=req.files.bkphoto[0].path;
        }
        const [description, bkphoto] = await Promise.all([
         UploadOnCloudinary(descriptionlocalpath),
         UploadOnCloudinary(bkphotolocalpath)
    ]);


        const creator=req.user;
        if(!creator){
            throw error(500,"Cannot access creator id")
        }
        const Project=await project.create({
            pjt_name,money,deswritten,complete_date,bkphoto:bkphoto?.url || "",creator:creator._id,description:description?.url||"",specilities
        })
        if(!Project){
            throw new ApiError(500,"Something went wrong while creating new project");
        }
        return res.status(201).json(
        new ApiResponse(200, Project, "New project created succesfully")
    )
});

const deleteproject=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {projectid}=req.body;
    try{
    await project.findByIdAndDelete(projectid);
    return res.status(201).json(
        new ApiResponse(200, "Project deleted succesfully")
    )
    }
    catch{
        throw new ApiError(500,"Error deleting project");
    }
    
})

const editproject=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {projectid}=req.body;
    if(!projectid){
        throw new ApiError(404,"Project not found");
    }
    let {pjt_name,money,deswritten,complete_date,updatedes,updatebk,specilities}=req.body;
    const oldproject= await project.findById(projectid);
    
    if(!oldproject.creator._id.equals(userid)){
        throw new ApiError(401,"Unauthorized request");
    }
    if(!oldproject){
        throw new ApiError(500,"Error fetching project data");
    }
    if(!pjt_name){
        pjt_name=oldproject.pjt_name;
    }
    if(!money){
        money=oldproject.money;
    }
    if(!specilities){
        specilities=oldproject.specilities;
    }
    if(!deswritten){
        deswritten=oldproject.deswritten;
        if(deswritten.length>1000){
            throw new ApiError(400,"Description exceeds word limit of 1000 characters")
        }
    }
    if(!complete_date){
        complete_date=oldproject.complete_date;
    }
    let bkurl="";

    if(updatebk){
        let bklocalpath="";
        if(req.files && Array.isArray(req.files.bk) && req.files.bk.length>0){
            bklocalpath=req.files.bk[0].path;
            
        }
        
        const bk=await UploadOnCloudinary(bklocalpath);
        bkurl=bk?.url||"";
    }

    if(!updatebk){
        
        bkurl=oldproject.bkphoto;
    }

    let desurl="";
    if(updatedes){
        let deslocalpath="";
        
        if(req.files && Array.isArray(req.files.des) && req.files.des.length>0){
            deslocalpath=req.files.des[0].path;
            
        }
        
        
        const des=await UploadOnCloudinary(deslocalpath);
        desurl=des?.url||"";        
    }
    if(!updatedes){
        desurl=oldproject.description;
    }
let updatedproject=await project.findByIdAndUpdate(projectid,{
    $set:{
        pjt_name,
        money,
        deswritten,
        complete_date,
        description:desurl,bkphoto:bkurl,specilities
    }
},{new: true});
    return res.status(201).json(
        new ApiResponse(200,updatedproject, "Project edited succesfully")
    )
});

const sendproject=asynchandler(async(req,res)=>{
    const {projectid}=req.body;
    if(!projectid){
        throw new ApiError(404,"Project not found");
    }    
    const projectdata= await project.findById(projectid).populate("applied","_id fullname avatar").populate("accept","_id fullname");
    return res.status(201).json(
        new ApiResponse(200,projectdata, "Project edited succesfully")
    );
});
const sendprojectbyname=asynchandler(async(req,res)=>{
    const {projectname}=req.body;
    if(!projectname){
        throw new ApiError(404,"Project not found");
    }    
    const projectdata= await project.findOne({pjt_name:projectname}).populate("applied","_id fullname avatar").populate("accept","_id fullname");
    if(!projectdata){
        throw new ApiError(400,"Could not find project");
    }
    return res.status(201).json(
        new ApiResponse(200,projectdata, "Project edited succesfully")
    );
});

const apply = asynchandler(async (req, res) => {
    const userid = req.user?._id;
    if (!userid) {
        throw new ApiError(400, "Unauthorized request");
    }

    const { projectid } = req.body;
    if (!projectid) {
        throw new ApiError(404, "Project ID not found");
    }

    const projectDoc = await project.findById(projectid);
    if (!projectDoc) {
        throw new ApiError(404, "Project not found");
    }
    if (projectDoc.applied.includes(userid)) {
        throw new ApiError(409, "Already applied to this project");
    }

    projectDoc.applied.push(userid);
    await projectDoc.save();

    return res.status(201).json(
        new ApiResponse(200, projectDoc, "Applied to project successfully")
    );
});


const acceptproject=asynchandler(async(req,res)=>{
const adminid = req.user?._id;
    const { projectid,userid } = req.body;
    if (!adminid) {
        throw new ApiError(400, "Unauthorized request");
    }
    if (!projectid) {
        throw new ApiError(404, "Project ID not found");
    }
    const projectDoc = await project.findById(projectid);
    if(!projectDoc){
        throw new ApiError(404,"Project not found");
    }
    if (projectDoc.creator.toString() !== adminid.toString()) {
    throw new ApiError(400, "Unauthorized request");
}
if(projectDoc.accepted){
    throw new ApiError(400,"A user has already been assigned for the task, now you can't change it");
}
projectDoc.accepted=true;
    projectDoc.accept=userid;
    await projectDoc.save();

    return(res.status(201).json(new ApiResponse(200,projectDoc,"User approval accepted successfully")));

});
const updatestatus=asynchandler(async(req,res)=>{
    const userid=req.user?._id;
    const {projectid,status}=req.body;
    if(!userid){
        throw new ApiError(400,"Unauthorized request");
    }
    if(!projectid){
        throw new ApiError(404,"Project id not found");
    }
    if(!status){
        throw new ApiError(400,"Status is required");
    }
    const projectDoc = await project.findById(projectid);
    if(!projectDoc){
        throw new ApiError(404,"Project not found");
    }
    if(!projectDoc.accepted){
        throw new ApiError(400,"Unauthorized request");
    }
    if (projectDoc.accept._id.toString() !== userid.toString()) {
    throw new ApiError(400, "Unauthorized request");
    }
    if(projectDoc.completed){
        throw new ApiError(400,"You can submit project only once");
    }
    projectDoc.status=status;
    await projectDoc.save();
    return(res.status(201).json(new ApiResponse(200,projectDoc,"Project submitted successfully")));
});
const complete=asynchandler(async(req,res)=>{
    const userid=req.user?._id;
    const {projectid,code_link,pdt_link}=req.body;
    if(!userid){
        throw new ApiError(400,"Unauthorized request");
    }
    if(!projectid){
        throw new ApiError(404,"Project id not found");
    }
    if(!code_link){
        throw new ApiError(400,"Code link is required");
    }
    if(!pdt_link){
        throw new ApiError(400,"Project link is required");
    }
    const projectDoc = await project.findById(projectid);
    if(!projectDoc){
        throw new ApiError(404,"Project not found");
    }
    if(!projectDoc.accepted){
        throw new ApiError(400,"Unauthorized request");
    }
    if (projectDoc.accept._id.toString() !== userid.toString()) {
    throw new ApiError(400, "Unauthorized request");
    }
    if(projectDoc.completed){
        throw new ApiError(400,"You can submit project only once");
    }
    projectDoc.code_link=code_link;
    projectDoc.pdt_link=pdt_link;
    projectDoc.final_date=new Date();
    projectDoc.completed=true;
    await projectDoc.save();
    return(res.status(201).json(new ApiResponse(200,projectDoc,"Project submitted successfully")));
});

const review=asynchandler(async(req,res)=>{
    const admid=req.user?._id;
    const {projectid,rating,review}=req.body;
    if(!admid){
        throw new ApiError(400,"Unauthorized request");
    }
    if(!projectid){
        throw new ApiError(404,"Project not found");
    }
    if(!rating){
        throw new ApiError(400,"Rating is required");
    }
    if(!review){
        throw new ApiError(404,"Review could not be empty");
    }
    const projectDoc = await project.findById(projectid);
    if(!projectDoc){
        throw new ApiError(404,"Project not found");
    }
    if(!projectDoc.accepted || !projectDoc.completed){
        throw new ApiError(400,"Unauthorized request");
    }
    if (projectDoc.creator._id.toString() !== admid.toString()) {
    throw new ApiError(400, "Unauthorized request");
    }
    projectDoc.rating_user=rating;
    projectDoc.user_review=review;
    projectDoc.reviewed=true;
    await projectDoc.save();
    return(res.status(201).json(new ApiResponse(200,projectDoc,"Project submitted successfully")));
});

const removeapply = asynchandler(async (req, res) => {
    const userid = req.user?._id;
    if (!userid) {
        throw new ApiError(400, "Unauthorized request");
    }

    const { projectid } = req.body;
    if (!projectid) {
        throw new ApiError(404, "Project ID not found");
    }

    const projectDoc = await project.findById(projectid);
    if (!projectDoc) {
        throw new ApiError(404, "Project not found");
    }
    if (!projectDoc.applied.includes(userid)) {
        throw new ApiError(409, "Never applied for this project");
    }
    if(projectDoc.accepted){
        throw new ApiError(400,"Project has been accepted, you cant remove your apply now");
    }

    projectDoc.applied=projectDoc.applied.filter(e=>
        e._id.toString()!=userid.toString()
    )
    await projectDoc.save();

    return res.status(201).json(
        new ApiResponse(200, projectDoc, "Applied successfully removed")
    );
});
const getProjectSummaries = asynchandler(async (req, res) => {
    // const user=req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
// const mongoose = require('mongoose');
// const a = new mongoose.Types.ObjectId(req.user._id);
    const a=req.user._id;
    const projects = await project.find(
    { accept: { $exists: false } ,
    creator: { $ne: a },
    applied: { $ne: a }
  },
    {
      _id: 1,
      creator: 1,
      applied: 1,
      accept: 1,
      reviewed: 1,
      specilities: 1
    }
  )
    .skip(skip)
    .limit(limit)
    .lean();

  const summary = projects.map(p => ({
    projectId: p._id,
    creatorId: p.creator,
    appliedIds: p.applied,
    acceptedId: p.accept,
    reviewed: p.reviewed || false,
    specilities: p.specilities
  }));

  return res.status(200).json({ success: true, data: summary });
});

const userappliedprojects = asynchandler(async (req, res) => {
const {userid}=req.body;
if(!userid){
    throw new ApiError(400,"User dont exist");
}
    const user= await User.findById(userid);
  const projects = await project.find({
//   accept: { $ne: userid },
  applied: userid
}).lean();
    if(!projects){
        throw new ApiError(400,"User didnt applied for any project");
    }
    let totalrating=0;
    let count=0;
    for (const p of projects) {
    const rating = p.rating_user;
    if (rating && rating > 0) {
      totalrating += rating;
      count++;
    }
}
    const avgRating = count > 0 ? (totalrating / count).toFixed(2) : 0;
    user.avgrating=avgRating;
    await user.save();
  // Map each project to desired output format
  const summary = projects.map(p => ({
    projectId: p._id,
    pjt_name:p.pjt_name,
    creatorId: p.creator,
    appliedIds: p.applied,
    acceptedId: p.accept,
    reviewed: p.reviewed || false,
    accepted:p.accepted,
    completed:p.completed,
    specilities: p.specilities,
    com_date:p.complete_date,
    status:p.status,
    final_date:p.final_date,
    user_review:p.user_review,
    rating_user:p.rating_user,
    money:p.money,
    paid:p.paid,
    // reviewed:p.reviewed
  }));

  return res.status(200).json({ success: true, data: summary });
});

const usercreatedprojects = asynchandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
const {userid}=req.body;
if(!userid){
    throw new ApiError(400,"User dont exist");
}
  const projects = await project.find({creator:userid}).populate("applied","_id username specilities avgrating").populate("accept","_id username").skip(skip).limit(limit).lean();
    if(!projects){
        throw new ApiError(400,"User didnt created any project");
    }
  // Map each project to desired output format
  const summary = projects.map(p => ({
    pjt_name:p.pjt_name,
    projectId: p._id,
    creatorId: p.creator,
    reviewed: p.reviewed || false,
    accepted:p.accepted,
    completed:p.completed,
    specilities: p.specilities,
    applied:p.applied,
    accept:p.accept,
    pdt_link:p.pdt_link,
    code_link:p.code_link,
    paid:p.paid,
    status:p.status,
    com_date:p.complete_date
  }));
  return res.status(200).json({ success: true, data: summary });
});




/*
    applied accepted and completed can be done through same fxn only a bit complex frontend needed
*/

export {createproject,deleteproject,updatestatus,editproject,sendproject,apply,acceptproject,complete,review,removeapply,getProjectSummaries,sendprojectbyname,userappliedprojects,usercreatedprojects};