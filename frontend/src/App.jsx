import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import { PageLoading } from './components/common/Loading';

// Home page - load immediately
import Home from './pages/Home';

// Lazy load other pages for better performance
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const LessonPlayer = lazy(() => import('./pages/LessonPlayer'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Payment = lazy(() => import('./pages/Payment'));
const Profile = lazy(() => import('./pages/Profile'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const Certificates = lazy(() => import('./pages/Certificates'));
const CertificateDetail = lazy(() => import('./pages/CertificateDetail'));
const CertificateVerify = lazy(() => import('./pages/CertificateVerify'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages - lazy loaded
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const CourseForm = lazy(() => import('./pages/admin/CourseForm'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));

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
    <HelmetProvider>
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
          <Suspense fallback={<PageLoading />}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
