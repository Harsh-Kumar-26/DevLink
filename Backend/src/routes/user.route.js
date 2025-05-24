import express from "express";
import {registeruser,loginuser,logoutuser,refreshaccesstoken} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import {createproject} from "../controllers/project.controller.js"

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


    export default router;