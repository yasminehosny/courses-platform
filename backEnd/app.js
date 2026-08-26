import "./config/env.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import userRoutes from "./routers/userRoutes.js";
import courseRoutes from "./routers/courseRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import errorHandlingMW from "./middelwares/errorHandling.js";
import authRoutes from "./routers/authRoutes.js";
import lessonRoutes from "./routers/lessonRoutes.js";
import enrollmentRoutes from "./routers/enrollmentRoutes.js";
import { getMyEnrollments } from "./controllers/enrollmentController.js";
import { authMiddleware, allowedTo } from "./middelwares/authMW.js";
import commentRoutes from "./routers/commentRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

console.log(
  "MONGO_URI (loaded):",
  process.env.MONGO_URI ? "<present>" : "<missing>"
);

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err.message);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use(morgan("dev"));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir =
  process.env.UPLOAD_DIR ||
  (process.env.VERCEL ? "/tmp/uploads" : join(__dirname, "uploads"));

app.use("/uploads", express.static(uploadDir));

app.use("/users", userRoutes);
app.use("/users", authRoutes);
app.use("/courses", courseRoutes);
app.use("/categories", categoryRoutes);
app.use("/courses/:courseId/lessons", lessonRoutes);
app.use("/courses/:courseId/enroll", enrollmentRoutes);

app.get(
  "/enrollments/me",
  authMiddleware,
  allowedTo("student"),
  getMyEnrollments
);

app.use("/lessons/:lessonId/comments", commentRoutes);
app.use(errorHandlingMW);

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("DB Connection Error:", err.message);
      process.exit(1);
    });
}
