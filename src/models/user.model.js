import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
 
const userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true   //for making searchable
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type:String,  //cloudnary url
    required:true,
  },
  coverImage:{
    type:String,
  },
  watchHistory:[
    {
      type:Schema.Types.ObjectId,
      ref:"Video"
    }
  ],
  password:{
    type:String,
    required:[true,"Password is required"]

  },
  refreshToken:{
    type:String
  }

},{timestamps:true})

userSchema.pre('save',async function (next) {    //middleware
  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password , 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password){    //function
  return await bcrypt.compare(password,this.password) //true or false
}

export const User = mongoose.model("User",userSchema)