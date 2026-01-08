import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LevelBadge } from '../common/Badge';

const CourseCard = ({ course }) => {
  const { t } = useTranslation();

  const levelLabels = {
    beginner: 'Анхан шат',
    intermediate: 'Дунд шат',
    advanced: 'Ахисан шат',
  };

  return (
    <Link
      to={`/courses/${course._id || course.id}`}
      className="group block"
    >
      <div className="card-hover h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            {course.price > 0 ? (
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-primary-700 shadow-sm">
                {course.price.toLocaleString()} ₮
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-success-500 text-white rounded-full text-sm font-bold shadow-sm">
                Үнэгүй
              </span>
            )}
          </div>

          {/* Level Badge */}
          {course.level && (
            <div className="absolute bottom-3 left-3">
              <LevelBadge level={course.level} />
            </div>
          )}

          {/* Enrolled Indicator */}
          {course.isEnrolled && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1.5 bg-success-500 text-white rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Бүртгүүлсэн
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          {/* Instructor */}
          {course.instructorId && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {course.instructorId.firstName?.[0]}{course.instructorId.lastName?.[0]}
              </div>
              <span className="text-sm text-slate-600">
                {course.instructorId.firstName} {course.instructorId.lastName}
              </span>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              {course.lessonCount > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.lessonCount} хичээл
                </span>
              )}
              {course.enrollmentCount > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {course.enrollmentCount}
                </span>
              )}
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
