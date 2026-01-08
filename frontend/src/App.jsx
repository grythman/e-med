import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import './i18n/config';
import useAuthStore from './store/authStore';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';
import Quiz from './pages/Quiz';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import Certificates from './pages/Certificates';
import CertificateDetail from './pages/CertificateDetail';
import CertificateVerify from './pages/CertificateVerify';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCourses from './pages/admin/Courses';
import CourseForm from './pages/admin/CourseForm';
import AdminPayments from './pages/admin/Payments';

function App() {
  const { i18n } = useTranslation();
  const { fetchCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch current user on mount if token exists
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  return (
    <ErrorBoundary>
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/lessons/:id" element={<LessonPlayer />} />
            <Route path="/lessons/:id/quiz" element={<Quiz />} />
            <Route
              path="/courses/:courseId/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/courses" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/courses" replace /> : <Register />}
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Certificate Routes */}
            <Route path="/certificates/verify/:code" element={<CertificateVerify />} />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates/:id"
              element={
                <ProtectedRoute>
                  <CertificateDetail />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminCourses />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses/new"
              element={
                <AdminRoute>
                  <CourseForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses/:id/edit"
              element={
                <AdminRoute>
                  <CourseForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AdminRoute>
                  <AdminPayments />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
