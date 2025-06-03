import fs from "fs"
import { v2 as cloudinary } from 'cloudinary';
import { log } from "console";


    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const UploadOnCloudinary=async(localFilePath)=>{
        try {
            if(!localFilePath){
                console.error("Local File for cloudinary not found");
                
                return null;
            }
            const response=await cloudinary.uploader.upload(localFilePath,
                {
                    resource_type:"auto"
                }
            )
            fs.unlinkSync(localFilePath)
            return response
        } catch (error) {
            fs.unlinkSync(localFilePath);       //unlink means delete it deteles localFilePath from server and sync means work is done syncronously
            console.error("Cloudinary upload error "+error);
            return null;
            
        }
    }
   
export default UploadOnCloudinary;