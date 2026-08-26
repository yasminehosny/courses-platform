import {Schema, model} from "mongoose";
const categorySchema = Schema({
    studentID:{
        type:Schema.Types.ObjectId,
        ref:"User", 
    },
    courseID:{
        type:Schema.Types.ObjectId,
        ref:"Course",
    },
    enrolledAt:{
        type:Date,
        default:Date.now,
    },
    completedLessons:{
        type:[Schema.Types.ObjectId],
        ref:"Lesson",
    },
    isCompleted:{
        type:Boolean,
        default:false,
    }
},{ timestamps: true })
export default model("Enrollment",categorySchema)
    