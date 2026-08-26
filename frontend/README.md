# 🎓 Online Course Platform - Frontend

A modern, responsive React frontend for an online learning platform where students can enroll in courses and instructors can manage their content.

Built with **React**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

- **Authentication System**: Login/Register with JWT tokens
- **Student Features**:
  - Browse and search courses
  - Enroll in courses
  - Track learning progress
  - View lessons and course content
  - Rate and review courses
  - Leave comments on lessons
  - View personal learning dashboard
  
- **Instructor Features**:
  - Create and manage courses
  - Upload course images
  - Create and manage lessons
  - View student enrollments
  - Track course performance

- **UI/UX**:
  - Light/Dark theme support
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Loading states and error handling
  - Pagination for course listings

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Context API | State management |
| Axios | HTTP requests |
| React Icons | Icon library |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation header
│   │   ├── Footer.jsx          # Footer component
│   │   └── StarRating.jsx      # Rating component
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── ThemeContext.jsx    # Dark/Light theme
│   ├── pages/
│   │   ├── HomePage.jsx                # Course listing
│   │   ├── LoginPage.jsx               # Login form
│   │   ├── RegisterPage.jsx            # Registration form
│   │   ├── CourseDetailPage.jsx        # Course details
│   │   ├── LessonPage.jsx              # Lesson content
│   │   ├── MyLearningPage.jsx          # Student dashboard
│   │   ├── DashboardPage.jsx           # Instructor dashboard
│   │   ├── CreateCoursePage.jsx        # Create course form
│   │   ├── EditCoursePage.jsx          # Edit course form
│   │   ├── AddLessonPage.jsx           # Add lesson form
│   │   ├── EditLessonPage.jsx          # Edit lesson form
│   │   ├── AddCategoryPage.jsx         # Add category form
│   │   └── Pagination.jsx              # Pagination component
│   ├── services/
│   │   └── api.js              # API calls
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── vite.config.js              # Vite configuration
├── index.html                  # HTML template
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/courses-platform.git
cd courses-platform/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment configuration

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 4. Run the development server

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

---

## 🔐 Authentication Context

The `AuthContext` manages:
- Current user information
- Authentication tokens (access & refresh)
- Login/logout functionality
- Role-based access control

**Usage**:
```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  // ...
}
```

---

## 🎨 Theme Context

The `ThemeContext` provides:
- Light/Dark theme toggle
- Theme persistence in localStorage

**Usage**:
```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  // ...
}
```

---

## 🌐 API Integration

All API calls are managed in `services/api.js`.

**Main functions**:
- **Authentication**: `login()`, `register()`, `logout()`
- **Courses**: `getCourses()`, `getCourseById()`, `createCourse()`, `updateCourse()`, `deleteCourse()`
- **Lessons**: `getLessons()`, `createLesson()`, `updateLesson()`, `deleteLesson()`
- **Enrollment**: `enrollCourse()`, `getMyEnrollments()`, `completeLesson()`, `getCourseProgress()`
- **Categories**: `getCategories()`, `addCategory()`
- **Comments**: `addComment()`, `getComments()`, `updateComment()`, `deleteComment()`
- **Ratings**: `addRating()`, `getCourseRatings()`

---

## 📱 Pages Overview

### Public Pages
- **HomePage**: Browse all courses with search and pagination
- **CourseDetailPage**: View course details, ratings, and instructor info
- **LessonPage**: View lesson content and comments
- **LoginPage**: User login form
- **RegisterPage**: User registration form

### Student Pages (Protected)
- **MyLearningPage**: View enrolled courses and track progress

### Instructor Pages (Protected)
- **DashboardPage**: Manage courses and view enrollments
- **CreateCoursePage**: Create new course with image upload
- **EditCoursePage**: Edit existing course
- **AddLessonPage**: Add new lesson to a course
- **EditLessonPage**: Edit existing lesson
- **AddCategoryPage**: Create new course category

---

## 🎯 Routing Structure

```
/ (home)
/login
/register
/courses/:id (course details)
/courses/:courseId/lessons/:id (lesson content)
/my-learning (student dashboard)
/dashboard (instructor dashboard)
/dashboard/create-course (create course)
/dashboard/edit-course/:id (edit course)
/dashboard/add-lesson/:courseId (add lesson)
/dashboard/courses/:courseId/edit-lesson/:id (edit lesson)
/dashboard/add-category (add category)
```

---

## 💾 Local Storage

The application stores:
- `authToken`: JWT access token
- `refreshToken`: JWT refresh token
- `user`: Current user information
- `theme`: Current theme preference (light/dark)

---

## 🧪 Development Tips

### Enable Debug Mode
Set `VITE_DEBUG=true` in `.env` to see API requests in the console.

### Mock API
For local testing without backend, you can use mock data in `services/api.js`.

### Component Reusability
Common UI elements (buttons, inputs, cards) are styled with Tailwind CSS utilities.

---

## 📦 Dependencies

Key packages used:
- `react-router-dom`: Client-side routing
- `axios`: HTTP client
- `react-icons`: Icon library
- `tailwindcss`: Utility-first CSS

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/feature-name`)
2. Commit your changes (`git commit -m 'Add feature'`)
3. Push to the branch (`git push origin feature/feature-name`)
4. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Support

For issues and feature requests, please open an issue on GitHub.
