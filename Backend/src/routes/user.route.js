import express from "express";
import {registeruser,loginuser,logoutuser,refreshaccesstoken,getcurrentuser,editprofile,getuserfromid} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import {createproject,deleteproject,sendprojectbyname,editproject, sendproject,apply,acceptproject,complete,review,removeapply,getProjectSummaries,userappliedprojects,usercreatedprojects} from "../controllers/project.controller.js"

const router=express.Router();
router.route("/signup").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]) ,
    registeruser);
    router.route("/login").post(loginuser);
    router.route("/logout").post(verifyJWT,logoutuser);
    router.route("/refreshtoken").post(refreshaccesstoken);
    router.route("/current-user").get(verifyJWT,getcurrentuser);
    router.route("/user-from-id").post(getuserfromid);
    router.route("/newproject").post(upload.fields([
        {
            name:"bkphoto",
            maxCount:1
        },
        {
            name:"description",
            maxCount:1
        }
    ]),verifyJWT,createproject);
    router.route("/edit-profile").patch(upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"dis",
            maxCount:1
        }]),verifyJWT,editprofile);
    
router.route("/delete-project").post(verifyJWT,deleteproject);
router.route("/edit-project").patch(upload.fields([
        {
            name:"bk",
            maxCount:1
        },{
            name:"des",
            maxCount:1
        }]),verifyJWT,editproject);
router.route("/send-project").post(verifyJWT,sendproject);
router.route("/apply").post(verifyJWT,apply);
router.route("/accept").post(verifyJWT,acceptproject);
router.route("/complete").post(verifyJWT,complete);
router.route("/review").post(verifyJWT,review);
router.route("/removeapply").post(verifyJWT,removeapply);
router.route("/allprojects").get(verifyJWT,getProjectSummaries);
router.route("/sendprojectbyname").post(verifyJWT,sendprojectbyname);
router.route("/userappliedprojects").post(verifyJWT,userappliedprojects);
router.route("/usercreatedprojects").post(verifyJWT,usercreatedprojects);

export default router;