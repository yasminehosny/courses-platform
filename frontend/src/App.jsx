import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import MyLearningPage from './pages/MyLearningPage';
import DashboardPage from './pages/DashboardPage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';
import AddLessonPage from './pages/AddLessonPage';
import EditLessonPage from './pages/EditLessonPage';
import AddCategoryPage from './pages/AddCategoryPage';
import Footer from './components/Footer';
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-wrap">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function Layout({ children }) {
  return <><Navbar />{children} <Footer/></>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/courses/:id" element={<Layout><CourseDetailPage /></Layout>} />
      <Route path="/courses/:courseId/lessons/:id" element={<Layout><LessonPage /></Layout>} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

      {/* Student */}
      <Route path="/my-learning" element={<ProtectedRoute role="student"><Layout><MyLearningPage /></Layout></ProtectedRoute>} />

      {/* Instructor */}
      <Route path="/dashboard" element={<ProtectedRoute role="instructor"><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/create-course" element={<ProtectedRoute role="instructor"><Layout><CreateCoursePage /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/edit-course/:id" element={<ProtectedRoute role="instructor"><Layout><EditCoursePage /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/add-lesson/:courseId" element={<ProtectedRoute role="instructor"><Layout><AddLessonPage /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/courses/:courseId/edit-lesson/:id" element={<ProtectedRoute role="instructor"><Layout><EditLessonPage /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/add-category" element={<ProtectedRoute role="instructor"><Layout><AddCategoryPage /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
