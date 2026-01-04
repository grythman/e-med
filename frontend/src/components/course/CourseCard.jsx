import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CourseCard = ({ course }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {course.thumbnailUrl && (
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {course.level && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {course.level}
              </span>
            )}
            {course.language && (
              <span>{course.language.toUpperCase()}</span>
            )}
          </div>
          {course.price > 0 && (
            <span className="text-lg font-bold text-blue-600">
              {course.price.toLocaleString()} ₮
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          {course.instructorId && (
            <span>
              {course.instructorId.firstName} {course.instructorId.lastName}
            </span>
          )}
          {course.enrollmentCount > 0 && (
            <span>{course.enrollmentCount} {t('course.enrollmentCount')}</span>
          )}
        </div>

        <Link
          to={`/courses/${course._id || course.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {course.isEnrolled ? t('course.enrolled') : t('course.enroll')}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;

