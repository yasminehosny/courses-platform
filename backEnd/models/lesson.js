import {Schema, model} from "mongoose";
const categorySchema = Schema({
    title:{
        type:String,        
        required:true,  
    },
    content:{
        type:String,    
        required:true,  
    },
    videoUrl:{
        type:String,
        required:true,
    },
    courseID:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    order:{
        type:Number,
        
    },
    duration:{
        type:Number,
        required:true,
    }
},{ timestamps: true })
export default model("Lesson",categorySchema)
    