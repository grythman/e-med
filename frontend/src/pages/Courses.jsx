import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCourseStore from '../store/courseStore';
import CourseCard from '../components/course/CourseCard';
import Loading from '../components/common/Loading';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Courses = () => {
  const { t } = useTranslation();
  const { courses, pagination, isLoading, fetchCourses, filters } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = () => {
    fetchCourses({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    fetchCourses({ [key]: value, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('course.title')}</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value)}
          >
            <option value="">{t('course.level')} - Бүгд</option>
            <option value="beginner">Эхлэгч</option>
            <option value="intermediate">Дунд</option>
            <option value="advanced">Дэвшилтэт</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.language || ''}
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            <option value="">{t('course.language')} - Бүгд</option>
            <option value="mn">Монгол</option>
            <option value="en">Англи</option>
          </select>
          <Button onClick={handleSearch} className="w-full">
            {t('common.search')}
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <Loading />
      ) : courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => fetchCourses({ page: pagination.page - 1 })}
              >
                Өмнөх
              </Button>
              <span className="px-4">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchCourses({ page: pagination.page + 1 })}
              >
                Дараах
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('course.noCourses')}</p>
        </div>
      )}
    </div>
  );
};

export default Courses;

