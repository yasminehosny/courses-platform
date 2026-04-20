import {Schema, model} from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique:true,
    
  },
  password: {
    type:String,
    required:true,
    minlength:6,
    maxlength:8

  },
  role:{
    type:String,
    enum:['student','instructor'],
    default:'student'
  }
},{ timestamps: true });
userSchema.pre("save", async function () {
  
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword){
 const isMatched = await bcrypt.compare(candidatePassword,this.password);
 return isMatched;
}
export default model("User",userSchema)