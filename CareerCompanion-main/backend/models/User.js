import mongoose from "mongoose";
import validator from "validator";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    resumeUploads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume"
    }],
    skills: {
        type: [String],
        default: []
    }
},{timestamps:true,minimize:false})

const User=mongoose.model("User",userSchema);
export default User;


