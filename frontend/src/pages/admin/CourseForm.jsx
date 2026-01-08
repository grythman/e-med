import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { courseService } from '../../services/courseService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    durationHours: 0,
    level: 'beginner',
    language: 'mn',
    isPublished: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadCourse();
    }
  }, [id, isEdit]);

  const loadCourse = async () => {
    setIsLoading(true);
    try {
      const course = await courseService.getCourseById(id);
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        durationHours: course.durationHours || 0,
        level: course.level || 'beginner',
        language: course.language || 'mn',
        isPublished: course.isPublished || false,
      });
    } catch (error) {
      toast.error('Хичээл ачаалахад алдаа гарлаа');
      navigate('/admin/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEdit) {
        await courseService.updateCourse(id, formData);
        toast.success('Хичээл амжилттай шинэчлэгдлээ');
      } else {
        await courseService.createCourse(formData);
        toast.success('Хичээл амжилттай үүсгэгдлээ');
      }
      navigate('/admin/courses');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/courses')}>
          ← Буцах
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Хичээл засах' : 'Шинэ хичээл үүсгэх'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Гарчиг *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Хичээлийн гарчиг"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тайлбар
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Хичээлийн тайлбар"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Үнэ (₮) *
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Хугацаа (цаг) *
              </label>
              <Input
                name="durationHours"
                type="number"
                value={formData.durationHours}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          {/* Level & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Түвшин *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Эхлэгч</option>
                <option value="intermediate">Дунд</option>
                <option value="advanced">Ахисан</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Хэл *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mn">Монгол</option>
                <option value="en">Англи</option>
              </select>
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Нийтлэх
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/courses')}
            >
              Цуцлах
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;

