import {Schema, model} from "mongoose";
const categorySchema = Schema({
    content:{
        type:String,        
        required:true,
    },
    studentID:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    lessonID:{
        type:Schema.Types.ObjectId,
        ref:"Lesson"
    },
    createdAt:{
        type:Date,
         default:Date.now,
    }
},{ timestamps: true })
export default model("Comment",categorySchema)