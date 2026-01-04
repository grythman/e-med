import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAdminStore from '../../store/adminStore';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Courses = () => {
  const { t } = useTranslation();
  const {
    courses,
    coursesPagination,
    isLoadingCourses,
    error,
    fetchCourses,
    updateCourseStatus,
    deleteCourse,
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    isPublished: '',
  });

  useEffect(() => {
    fetchCourses({ page: 1, limit: 10 });
  }, [fetchCourses]);

  const handleSearch = () => {
    fetchCourses({ ...filters, page: 1, limit: 10 });
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    const result = await updateCourseStatus(courseId, !currentStatus);
    if (result.success) {
      fetchCourses({ ...filters, page: coursesPagination?.page || 1, limit: 10 });
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Энэ хичээлийг устгахдаа итгэлтэй байна уу?')) {
      const result = await deleteCourse(courseId);
      if (result.success) {
        fetchCourses({ ...filters, page: coursesPagination?.page || 1, limit: 10 });
      }
    }
  };

  if (isLoadingCourses) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Хичээлүүд</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Хайх..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.isPublished}
            onChange={(e) => setFilters({ ...filters, isPublished: e.target.value })}
          >
            <option value="">Бүх статус</option>
            <option value="true">Нийтлэгдсэн</option>
            <option value="false">Нийтлэгдээгүй</option>
          </select>
          <Button onClick={handleSearch}>Хайх</Button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Гарчиг
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Багш
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үнэ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдлүүд
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id || course.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500">{course.description?.substring(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.instructorId
                    ? `${course.instructorId.firstName} ${course.instructorId.lastName}`
                    : 'Тодорхойгүй'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat('mn-MN', {
                    style: 'currency',
                    currency: 'MNT',
                    minimumFractionDigits: 0,
                  }).format(course.price || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      course.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.isPublished ? 'Нийтлэгдсэн' : 'Нийтлэгдээгүй'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      variant={course.isPublished ? 'outline' : 'primary'}
                      onClick={() =>
                        handleTogglePublish(course._id || course.id, course.isPublished)
                      }
                    >
                      {course.isPublished ? 'Нийтлэлээс авах' : 'Нийтлэх'}
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleDelete(course._id || course.id)}
                    >
                      Устгах
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {coursesPagination && coursesPagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div>
              Хуудас {coursesPagination.page} / {coursesPagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="small"
                disabled={coursesPagination.page === 1}
                onClick={() =>
                  fetchCourses({
                    ...filters,
                    page: coursesPagination.page - 1,
                    limit: 10,
                  })
                }
              >
                Өмнөх
              </Button>
              <Button
                variant="outline"
                size="small"
                disabled={coursesPagination.page === coursesPagination.totalPages}
                onClick={() =>
                  fetchCourses({
                    ...filters,
                    page: coursesPagination.page + 1,
                    limit: 10,
                  })
                }
              >
                Дараах
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;

