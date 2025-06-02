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
            // console.log("File uploaded succesfully on cloudinary "+response);
            fs.unlinkSync(localFilePath)
            return response
        } catch (error) {
            fs.unlinkSync(localFilePath);       //unlink means delete it deteles localFilePath from server and sync means work is done syncronously
            console.error("Cloudinary upload error "+error);
            return null;
            
        }
    }
    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    

export default UploadOnCloudinary;