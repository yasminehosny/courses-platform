# 🎓 Online Course Platform

A full-stack online learning platform where instructors can create and manage courses, and students can enroll, learn, and track their progress.

**Live Demo**: [Coming Soon]

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Future Enhancements](#future-enhancements)

---

## 🚀 Features

### For Students
✅ User registration and authentication  
✅ Browse and search courses  
✅ Enroll in courses  
✅ Track learning progress  
✅ View lessons and course content  
✅ Rate and review courses  
✅ Leave comments on lessons  
✅ Personal learning dashboard  

### For Instructors
✅ Create and manage courses  
✅ Upload course images  
✅ Create and manage lessons  
✅ View student enrollments  
✅ Track course performance  

### General
✅ Light/Dark theme support  
✅ Responsive design (mobile, tablet, desktop)  
✅ JWT authentication  
✅ Error handling and validation  
✅ File upload with Multer  

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: React Icons

---

## 📁 Project Structure

```
courses-platform/
│
├── backEnd/
│   ├── controllers/          # Business logic
│   ├── middlewares/          # Custom middleware
│   ├── models/               # MongoDB schemas
│   ├── routers/              # API routes
│   ├── validation/           # Input validation
│   ├── utlis/                # Helper functions
│   ├── uploads/              # Uploaded files
│   ├── app.js                # Express app setup
│   ├── package.json
│   └── README.md             # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API integration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── index.html
│   ├── package.json
│   └── README.md             # Frontend documentation
│
└── LearnHub.postman_collection.json  # API testing
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backEnd
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/courses-platform
JWT_ACCESS_TOKEN_SECRET=your_secret_key_here
JWT_REFRESH_TOKEN_EXP=7d
```

5. **Start the server**
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

The backend will run at `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

4. **Start the development server**
```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

---

## 📚 API Documentation

Full API documentation is available in [backEnd/README.md](./backEnd/README.md)

### Key Endpoints

**Authentication**
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `PUT /users/me` - Update profile

**Courses**
- `GET /courses` - Get all courses
- `POST /courses` - Create course (instructor)
- `GET /courses/:id` - Get course details
- `PUT /courses/:id` - Update course (instructor)
- `DELETE /courses/:id` - Delete course (instructor)

**Lessons**
- `POST /courses/:courseId/lessons` - Create lesson (instructor)
- `GET /courses/:courseId/lessons` - Get course lessons
- `PUT /lessons/:id` - Update lesson (instructor)
- `DELETE /lessons/:id` - Delete lesson (instructor)

**Enrollment**
- `POST /courses/:courseId/enroll` - Enroll in course (student)
- `GET /enrollments/me` - Get my enrollments (student)
- `POST /courses/:courseId/lessons/:lessonId/complete` - Mark lesson complete (student)
- `GET /courses/:courseId/progress` - Get course progress (student)

**Comments**
- `POST /lessons/:lessonId/comments` - Add comment (student)
- `GET /lessons/:lessonId/comments` - Get lesson comments
- `PUT /lessons/:lessonId/comments/:id` - Update comment (student)
- `DELETE /lessons/:lessonId/comments/:id` - Delete comment (student)

**Ratings**
- `POST /courses/:id/rating` - Rate course (student)
- `GET /courses/:id/ratings` - Get course ratings

---

## 🖥️ Frontend Documentation

Full frontend documentation is available in [frontend/README.md](./frontend/README.md)

### Pages

**Public**
- Home - Browse courses
- Course Details - View course information
- Lesson - View lesson content
- Login/Register - Authentication

**Student (Protected)**
- My Learning - Track enrollments and progress

**Instructor (Protected)**
- Dashboard - Manage courses
- Create/Edit Course - Course management
- Add/Edit Lesson - Lesson management
- Add Category - Category management

---

## 🧪 Testing

### Using Postman
1. Import `LearnHub.postman_collection.json` into Postman
2. Set environment variables (token, etc.)
3. Test all endpoints

### Manual Testing
```bash
# Test backend
curl http://localhost:4000/api/courses

# Test frontend
Open http://localhost:5173 in browser
```

---

## 🔐 Authentication Flow

1. User registers/logs in
2. Server returns JWT access token
3. Client stores token in localStorage
4. Client includes token in Authorization header for protected routes
5. Server validates token in middleware
6. Request proceeds or returns 401/403 error

---

## 📊 Database Models

### User
- Email, name, password (hashed)
- Role (instructor/student)
- Profile picture
- Timestamps

### Course
- Title, description, price
- Instructor (User reference)
- Category (Category reference)
- Image URL
- Ratings and reviews
- Timestamps

### Lesson
- Title, content
- Course (Course reference)
- Timestamps

### Enrollment
- Student (User reference)
- Course (Course reference)
- Completed lessons array
- Is completed flag
- Timestamps

### Comment
- Content
- Student (User reference)
- Lesson (Lesson reference)
- Timestamps

### Category
- Name, description
- Timestamps

---

## 🚀 Deployment

### Backend (Render/Heroku)
```bash
# Push to GitHub
# Connect to Render/Heroku
# Set environment variables
# Deploy
```

### Frontend (Vercel/Netlify)
```bash
# Run build
npm run build

# Deploy dist folder to Vercel/Netlify
```

---

## 🔄 Future Enhancements

- [ ] Video hosting and streaming
- [ ] Certificate of completion
- [ ] Discussion forums
- [ ] Live chat support
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team

---

## 👥 Team

- **Full Stack Developer**: Your Name
- **UI/UX Designer**: [Name]
- **DevOps**: [Name]

---

## 🙏 Acknowledgments

- MongoDB documentation
- Express.js guides
- React documentation
- Tailwind CSS
- Open source community

---

**Happy Learning! 🚀**
