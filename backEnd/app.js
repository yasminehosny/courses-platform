import express from "express"
import mongoose from "mongoose";
import morgan from "morgan"
import dotenv from "dotenv";
import cors from "cors"; 
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import userRoutes from "./routers/userRoutes.js"
import courseRoutes from "./routers/courseRoutes.js"
import categoryRoutes from "./routers/categoryRoutes.js"
import errorHandlingMW from "./middelwares/errorHandling.js"
import authRoutes from './routers/authRoutes.js'
import lessonRoutes from "./routers/lessonRoutes.js";
import enrollmentRoutes from "./routers/enrollmentRoutes.js";
import { getMyEnrollments } from "./controllers/enrollmentController.js";
import { authMiddleware, allowedTo } from "./middelwares/authMW.js";
import commentRoutes from "./routers/commentRoutes.js";
const app=express()

dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
  app.use(cors());
app.use(morgan("dev"))
app.use(express.json())


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use("/uploads", express.static(join(__dirname, "uploads")));
app.use("/users",userRoutes)
app.use("/users",authRoutes)

app.use("/courses",courseRoutes)
app.use("/categories",categoryRoutes)
app.use("/courses/:courseId/lessons", lessonRoutes);
app.use("/courses/:courseId/enroll", enrollmentRoutes);
app.get("/enrollments/me", authMiddleware, allowedTo("student"), getMyEnrollments);
app.use("/lessons/:lessonId/comments", commentRoutes);
app.use(errorHandlingMW)
const PORT = process.env.PORT || 3000; 
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})