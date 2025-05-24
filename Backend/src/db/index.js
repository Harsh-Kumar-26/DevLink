import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB= async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected \n DB Host: ${connectionInstance.connection.host}`);
    }
    catch(err){
        console.error("MongoDB connection error  "+err);
        console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        process.exit(1);
    }
}
export default connectDB