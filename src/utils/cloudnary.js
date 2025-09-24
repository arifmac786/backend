import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

 cloudinary.config({ 
        cloud_name:process.env.CLOUDNARY_CLOUD_NAME, 
        api_key: process.env.CLOUDNARY_API_KEY, 
        api_secret:process.env.CLOUDNARY_API_SECRET  
    });

const uploadOnCloudnary = async (localFilePath) => {
   try{
       if(!localFilePath) return null
       // upload the file on cloudnary
       const response = await cloudinary.uploader.upload(localFilePath,{
         resource_type:"auto"
       })

       //file has been uploaded successfullly
       console.log(`file is uploaded on cloudnary ${response.url}`);
       return response;
       
   }catch(error){
      fs.unlinkSync(localFilePath)  // remove the localy save temporary file as the upload operation got failed
      return null;
   }
}    

export {uploadOnCloudnary}