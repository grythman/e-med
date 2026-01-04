import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import { courseService } from '../services/courseService';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const CourseDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { currentCourse, fetchCourseById, enrollInCourse, isLoading } = useCourseStore();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        await fetchCourseById(id);
        const courseLessons = await courseService.getCourseLessons(id);
        setLessons(courseLessons);
      } catch (error) {
        console.error('Error loading course:', error);
      }
    };

    loadCourse();
  }, [id, fetchCourseById]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await enrollInCourse(id);
    if (result.success) {
      // Refresh course data
      await fetchCourseById(id);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!currentCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Хичээл олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        {currentCourse.thumbnailUrl && (
          <img
            src={currentCourse.thumbnailUrl}
            alt={currentCourse.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-3xl font-bold mb-4">{currentCourse.title}</h1>
        <p className="text-gray-600 mb-6">{currentCourse.description}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {currentCourse.level && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
              {currentCourse.level}
            </span>
          )}
          {currentCourse.language && (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded">
              {currentCourse.language.toUpperCase()}
            </span>
          )}
          {currentCourse.durationHours && (
            <span className="text-gray-600">
              {currentCourse.durationHours} {t('course.duration')}
            </span>
          )}
          {currentCourse.price > 0 && (
            <span className="text-2xl font-bold text-blue-600">
              {currentCourse.price.toLocaleString()} ₮
            </span>
          )}
        </div>

        {currentCourse.instructorId && (
          <div className="mb-6">
            <p className="text-gray-600">
              {t('course.instructor')}: {currentCourse.instructorId.firstName} {currentCourse.instructorId.lastName}
            </p>
          </div>
        )}

        {!currentCourse.isEnrolled && currentCourse.price > 0 && (
          <Button onClick={handleEnroll} className="w-full md:w-auto">
            {t('course.enroll')}
          </Button>
        )}

        {currentCourse.isEnrolled && (
          <Button
            variant="secondary"
            onClick={() => navigate(`/courses/${id}/lessons`)}
            className="w-full md:w-auto"
          >
            {t('course.lessons')} үзэх
          </Button>
        )}
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">{t('course.lessons')}</h2>
        
        {loadingLessons ? (
          <Loading />
        ) : lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div
                key={lesson._id || lesson.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/lessons/${lesson._id || lesson.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {lesson.isPreview && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Preview
                      </span>
                    )}
                    {lesson.videoDuration && (
                      <span className="text-sm text-gray-500">
                        {Math.floor(lesson.videoDuration / 60)}:{(lesson.videoDuration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Хичээл байхгүй байна</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;

