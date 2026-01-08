import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCourseStore from '../store/courseStore';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const MyCourses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { myEnrollments, isLoadingEnrollments, fetchMyEnrollments, error } = useCourseStore();

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  if (isLoadingEnrollments) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('navigation.myCourses') || 'Миний хичээлүүд'}
          </h1>
          <p className="text-gray-600">
            Таны бүртгэлтэй хичээлүүд болон явцын мэдээлэл
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {myEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEnrollments.map((enrollment) => {
              const course = enrollment.courseId;
              const progressPercentage = enrollment.progressPercentage || 0;
              const isCompleted = progressPercentage === 100;

              return (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600">
                    {course?.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Completion Badge */}
                    {isCompleted && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Дууссан
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course?.title || 'Хичээлийн нэр'}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Явц</span>
                        <span className="font-medium text-blue-600">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-green-500' 
                              : progressPercentage > 50 
                                ? 'bg-blue-500' 
                                : 'bg-blue-400'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {enrollment.completedLessons || 0} / {enrollment.totalLessons || 0} хичээл дууссан
                      </p>
                    </div>

                    {/* Enrolled Date */}
                    <p className="text-xs text-gray-500 mb-4">
                      Бүртгүүлсэн: {new Date(enrollment.enrolledAt).toLocaleDateString('mn-MN')}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/courses/${course?._id}`)}
                        className="flex-1"
                        variant={isCompleted ? 'secondary' : 'primary'}
                      >
                        {isCompleted ? 'Дахин үзэх' : 'Үргэлжлүүлэх'}
                      </Button>
                      
                      {isCompleted && enrollment.certificateId && (
                        <Button
                          onClick={() => navigate(`/certificates/${enrollment.certificateId}`)}
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Та одоогоор хичээлд бүртгүүлээгүй байна
            </h3>
            <p className="text-gray-600 mb-6">
              Манай хичээлүүдээс сонирхолтой хичээлээ олж бүртгүүлээрэй
            </p>
            <Button onClick={() => navigate('/courses')}>
              Хичээлүүд үзэх
            </Button>
          </div>
        )}

        {/* Stats Summary */}
        {myEnrollments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{myEnrollments.length}</p>
              <p className="text-gray-600 text-sm">Нийт хичээл</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {myEnrollments.filter(e => e.progressPercentage === 100).length}
              </p>
              <p className="text-gray-600 text-sm">Дууссан</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {myEnrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length}
              </p>
              <p className="text-gray-600 text-sm">Үргэлжилж байгаа</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-gray-600">
                {myEnrollments.filter(e => e.progressPercentage === 0).length}
              </p>
              <p className="text-gray-600 text-sm">Эхлээгүй</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

