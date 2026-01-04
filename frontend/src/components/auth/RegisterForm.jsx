import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Имэйл оруулах шаардлагатай';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Имэйл буруу форматтай';
    }
    if (!formData.password) {
      errors.password = 'Нууц үг оруулах шаардлагатай';
    } else if (formData.password.length < 8) {
      errors.password = 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой';
    }
    if (!formData.firstName) {
      errors.firstName = 'Нэр оруулах шаардлагатай';
    }
    if (!formData.lastName) {
      errors.lastName = 'Овог оруулах шаардлагатай';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/courses');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.register')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label={t('auth.firstName')}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={formErrors.firstName}
            required
          />

          <Input
            label={t('auth.lastName')}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={formErrors.lastName}
            required
          />

          <Input
            label={t('auth.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            error={formErrors.email}
            required
          />

          <Input
            label={t('auth.phone')}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
          />

          <Input
            label={t('auth.password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {t('auth.register')}
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Аль хэдийн бүртгэлтэй юу? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              {t('auth.login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

