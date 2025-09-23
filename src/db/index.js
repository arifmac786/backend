import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
  try{
   let connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
   console.log(`MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
   
  }catch(err){
    console.log(`MongoDB connection ERROR ${err.message}`);
    process.exit(1)
  }
}

export default connectDB;