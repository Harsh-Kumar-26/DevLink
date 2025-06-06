import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config();
connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log(err);
        throw err;
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Listening to port ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.error("MongoDB error failed "+err);
    
})