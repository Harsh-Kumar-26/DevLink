import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userrouter from "./routes/user.route.js"

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit: "16kb"}));     
app.use(express.static("public"))       
app.use(express.urlencoded({extended:true , limit: "16kb"}))        
app.use(cookieParser())

app.use("/devlink",userrouter);
export default app;