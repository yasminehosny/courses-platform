import axios from 'axios';

const BASE = 'http://localhost:4000';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r.data,
  e => Promise.reject(e.response?.data || { message: 'Network error' })
);

// ── Auth ──
export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);
export const getMe = () => api.get('/users/me');

// ── Categories ──
export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories/add', data);

// ── Courses ──
export const getCourses = (params) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const getMyCourses = () => api.get('/courses/my/courses');
export const rateCourse = (id, data) => api.post(`/courses/${id}/rate`, data);
export const getCourseRatings = (id) => api.get(`/courses/${id}/ratings`);
// ── Lessons ──
export const completeLesson = (courseId, lessonId) =>
  api.post(`/courses/${courseId}/enroll/${lessonId}/complete`);

export const getCourseProgress = (courseId) =>
  api.get(`/courses/${courseId}/enroll/progress`);
export const getLessons = (courseId) => api.get(`/courses/${courseId}/lessons`);
export const getLessonById = (courseId, id) => api.get(`/courses/${courseId}/lessons/${id}`);
export const addLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateLesson = (courseId, id, data) => api.put(`/courses/${courseId}/lessons/${id}`, data);
export const deleteLesson = (courseId, id) => api.delete(`/courses/${courseId}/lessons/${id}`);

// ── Enrollment ──
export const enrollCourse = (courseId) => api.post(`/courses/${courseId}/enroll`);
export const unenrollCourse = (courseId) => api.delete(`/courses/${courseId}/enroll`);
export const getMyEnrollments = () => api.get('/enrollments/me');
export const getCourseEnrollments = (courseId) => api.get(`/courses/${courseId}/enroll`);

// ── Comments ──
export const getComments = (lessonId) => api.get(`/lessons/${lessonId}/comments`);
export const addComment = (lessonId, data) => api.post(`/lessons/${lessonId}/comments`, data);
export const updateComment = (lessonId, id, data) => api.put(`/lessons/${lessonId}/comments/${id}`, data);
export const deleteComment = (lessonId, id) => api.delete(`/lessons/${lessonId}/comments/${id}`);

//  Fix: don't double-prefix full URLs
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE}/${path}`;
};
export const getVideoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE}/${path}`;
};

export const getApiErrorMessage = (err, fallback = 'Something went wrong') => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (err.message && typeof err.message === 'string') return err.message;

  const validationErrors = err.errors || err.error || err.details;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    const first = validationErrors[0];
    if (typeof first === 'string') return first;
    if (first?.msg) return first.msg;
    if (first?.message) return first.message;
  }

  return fallback;
};
