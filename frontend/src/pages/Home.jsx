import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCourseStore from '../store/courseStore';
import CourseCard from '../components/course/CourseCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const Home = () => {
  const { t } = useTranslation();
  const { courses, isLoading, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses({ limit: 6 });
  }, [fetchCourses]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Эмчийн Сургалтын Онлайн Платформ
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Мэргэжлийн сургалтууд, баталгаатай мэдлэг
          </p>
          <Link to="/courses">
            <Button size="large" variant="secondary">
              Хичээлүүд үзэх
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Онцлох Хичээлүүд
          </h2>
          
          {isLoading ? (
            <Loading />
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('course.noCourses')}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/courses">
              <Button variant="outline">
                Бүх хичээлүүд үзэх
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

