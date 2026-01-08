import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAdminStore from '../../store/adminStore';
import { adminService } from '../../services/adminService';
import Loading from '../../components/common/Loading';
import RevenueChart from '../../components/admin/RevenueChart';
import EnrollmentChart from '../../components/admin/EnrollmentChart';
import PopularCoursesChart from '../../components/admin/PopularCoursesChart';

const Dashboard = () => {
  const { t } = useTranslation();
  const { stats, isLoadingStats, fetchDashboardStats } = useAdminStore();
  const [revenueData, setRevenueData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    loadAnalytics();
  }, [fetchDashboardStats]);

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const [revenue, enrollments, courses] = await Promise.all([
        adminService.getRevenueAnalytics(),
        adminService.getEnrollmentAnalytics(),
        adminService.getPopularCourses(),
      ]);
      setRevenueData(revenue);
      setEnrollmentData(enrollments);
      setPopularCourses(courses);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  if (isLoadingStats) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Админ Хяналтын Самбар</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Нийт Хэрэглэгчид</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.users.active} идэвхтэй
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Нийт Хичээлүүд</p>
                <p className="text-3xl font-bold text-gray-900">{stats.courses.total}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.courses.published} нийтлэгдсэн
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          {/* Enrollments Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Нийт Бүртгэл</p>
                <p className="text-3xl font-bold text-gray-900">{stats.enrollments.total}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {stats.enrollments.recent} сүүлийн 7 хоногт
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Нийт Орлого</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat('mn-MN', {
                    style: 'currency',
                    currency: 'MNT',
                    minimumFractionDigits: 0
                  }).format(stats.payments.revenue)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.payments.recent} сүүлийн 7 хоногт
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      {!isLoadingAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Орлогын график (12 сар)</h2>
            <RevenueChart data={revenueData} />
          </div>

          {/* Enrollment Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Бүртгэлийн график (12 сар)</h2>
            <EnrollmentChart data={enrollmentData} />
          </div>
        </div>
      )}

      {/* Popular Courses */}
      {!isLoadingAnalytics && popularCourses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Эрэлттэй хичээлүүд (Top 10)</h2>
          <PopularCoursesChart courses={popularCourses} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Хурдан Үйлдлүүд</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-semibold text-blue-600">Хэрэглэгчид</h3>
            <p className="text-sm text-gray-600">Хэрэглэгчдийг удирдах</p>
          </a>
          <a
            href="/admin/courses"
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <h3 className="font-semibold text-green-600">Хичээлүүд</h3>
            <p className="text-sm text-gray-600">Хичээлүүдийг удирдах</p>
          </a>
          <a
            href="/admin/payments"
            className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <h3 className="font-semibold text-yellow-600">Төлбөрүүд</h3>
            <p className="text-sm text-gray-600">Төлбөрийн мэдээлэл</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

