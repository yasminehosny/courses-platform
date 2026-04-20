# 🎓 Online Course Platform API

A RESTful backend API for an online learning platform where instructors create courses and students enroll in them.

Built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## 🚀 Features

- JWT Authentication & Authorization
- Two roles: **Instructor** and **Student**
- Instructors can create, update, and delete courses and lessons
- Students can enroll in courses and track progress
- Course rating and review system
- Students can comment on lessons
- File upload (course images) using Multer
- Pagination and filtering for courses
- Centralized error handling
- Input validation using express-validator
- Progress tracking (completed lessons)

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| Multer | File upload handling |
| dotenv | Environment variables |
| morgan | HTTP request logger |

---

## 📁 Project Structure

```
backEnd/
├── controllers/
│   ├── userController.js
│   ├── authController.js
│   ├── courseController.js
│   ├── categoryController.js
│   ├── lessonController.js
│   ├── enrollmentController.js
│   └── commentController.js
├── middlewares/
│   ├── authMW.js
│   ├── errorHandling.js
│   └── validationMiddleware.js
├── models/
│   ├── user.js
│   ├── course.js
│   ├── category.js
│   ├── lesson.js
│   ├── enrollment.js
│   └── comment.js
├── routers/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   ├── categoryRoutes.js
│   ├── lessonRoutes.js
│   ├── enrollmentRoutes.js
│   └── commentRoutes.js
├── validation/
│   ├── userValidation.js
│   ├── courseValidation.js
│   ├── categoryValidation.js
│   ├── lessonValidation.js
│   └── commentValidation.js
├── utlis/
│   └── httpError.js
├── .env
├── .env.example
├── app.js
└── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/courses-platform.git
cd courses-platform/backEnd
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your values.

### 4. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

The server will run at `http://localhost:4000`

---

## 🔐 Environment Variables

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/courses-platform
JWT_ACCESS_TOKEN_SECRET=your_secret_key
JWT_REFRESH_TOKEN_EXP=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

---

## 📤 File Upload (Multer)

- **Location**: `utlis/multer.js`
- **Max File Size**: 10MB
- **Allowed Types**: JPEG, PNG, WEBP
- **Usage**: Course images are uploaded when creating/updating courses
- **Access**: Use `/uploads/filename` to retrieve uploaded images

---

## 📌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/users/register` | Register a new user | Public |
| POST | `/users/login` | Login and get token | Public |

### Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users` | Get all users | Public |
| GET | `/users/:id` | Get user by ID | Public |
| GET | `/users/me` | Get my profile | Auth |
| PUT | `/users/me` | Update my profile | Auth |
| DELETE | `/users/me` | Delete my account | Auth |

### Categories
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/categories` | Add a category | Instructor |
| GET | `/categories` | Get all categories | Public |

### Courses
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/courses` | Create a course | Instructor |
| GET | `/courses` | Get all courses | Public |
| GET | `/courses/:id` | Get course by ID | Public |
| PUT | `/courses/:id` | Update a course | Instructor (owner) |
| DELETE | `/courses/:id` | Delete a course | Instructor (owner) |
| GET | `/courses/my/courses` | Get my courses | Instructor |
| POST | `/courses/:id/rating` | Add/Update course rating | Student |
| GET | `/courses/:id/ratings` | Get course ratings | Public |

### Lessons
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/courses/:courseId/lessons` | Add a lesson | Instructor |
| GET | `/courses/:courseId/lessons` | Get course lessons | Public |
| GET | `/lessons/:id` | Get lesson by ID | Public |
| PUT | `/lessons/:id` | Update a lesson | Instructor (owner) |
| DELETE | `/lessons/:id` | Delete a lesson | Instructor (owner) |

### Enrollments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/courses/:courseId/enroll` | Enroll in a course | Student |
| DELETE | `/courses/:courseId/enroll` | Unenroll from a course | Student |
| GET | `/courses/:courseId/enroll` | Get course enrollments | Instructor |
| GET | `/enrollments/me` | Get my enrollments | Student |
| POST | `/courses/:courseId/lessons/:lessonId/complete` | Mark lesson as complete | Student |
| GET | `/courses/:courseId/progress` | Get course progress | Student |

### Comments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/lessons/:lessonId/comments` | Add a comment | Student |
| GET | `/lessons/:lessonId/comments` | Get lesson comments | Public |
| PUT | `/lessons/:lessonId/comments/:id` | Update a comment | Student (owner) |
| DELETE | `/lessons/:lessonId/comments/:id` | Delete a comment | Student (owner) |

---

## 🔑 Authentication

This API uses **JWT (JSON Web Token)** for authentication.

After login, you will receive an `accessToken`. Include it in the request headers:

```
Authorization: Bearer <your_token>
```

---

## 📄 Models

| Model | Description |
|---|---|
| User | Stores user data with roles (instructor/student) |
| Course | Courses created by instructors |
| Category | Course categories |
| Lesson | Lessons belonging to a course |
| Enrollment | Student enrollments in courses |
| Comment | Student comments on lessons |

---

## ⚠️ Error Handling

The API uses centralized error handling with the following format:

```json
{
  "status": 400,
  "message": "Error message"
}
```

Error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Middleware

| Middleware | Usage |
|---|---|
| `authMW.js` | JWT authentication & role-based authorization |
| `errorHandling.js` | Centralized error handling |
| `validationMiddleware.js` | Request validation using express-validator |

---

## 📤 File Upload (Multer)

- **Location**: `utlis/multer.js`
- **Max File Size**: 10MB
- **Allowed Types**: JPEG, PNG, WEBP
- **Usage**: Course images are uploaded when creating/updating courses
- **Access**: Use `/uploads/filename` to retrieve uploaded images

---

## 👨‍💻 Author

Your Name — [GitHub](https://github.com/yasminehosny/courses-platform.git)