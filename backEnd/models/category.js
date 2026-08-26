import {Schema,model} from "mongoose";
const categorySchema = Schema({
    name:{
        type:String,                            
        required:true,      
    },
    description:{
        type:String,    
        required:true,
    }
},{ timestamps: true })
export default model("Category",categorySchema)