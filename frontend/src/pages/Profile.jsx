import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { authService } from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile, isLoading: authLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Профайл амжилттай шинэчлэгдлээ' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Алдаа гарлаа' });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">{t('navigation.profile')}</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {message && (
            <div
              className={`mb-4 p-4 rounded ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label={t('auth.firstName')}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <Input
              label={t('auth.lastName')}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <Input
              label={t('auth.email')}
              name="email"
              value={user?.email || ''}
              disabled
            />

            <Input
              label={t('auth.phone')}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="flex space-x-4 mt-6">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

