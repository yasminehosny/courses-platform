import  {Schema, model} from "mongoose";
const courseSchema = Schema({
 title:{
    type:String,
    required:true,
    minlength:2
 },
 description:{
    type:String,
    required:true,
    minlength:10
 },
 instructorID:{
    type:Schema.Types.ObjectId,
    ref:"User",
},
 categoryID:{
    type:Schema.Types.ObjectId,
    ref:"Category"
 },
 price:{
    type:Number,
    required:true,
     min:0
 },
 imageUrl: {
  type: String,
  required: true,
},
ratings: [{
    studentID: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
}
,{
     timestamps: true 
})
export default model("Course",courseSchema)