import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userrouter from "./routes/user.route.js"
import errorHandler from "./middlewares/error.middleware.js";

const app=express();
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit: "16kb"}));     
app.use(express.static("public"))       
app.use(express.urlencoded({extended:true , limit: "16kb"}))        
app.use(cookieParser())

app.use("/api/v1/devlink",userrouter);
// app.use("/api")
app.use(errorHandler);
export default app;