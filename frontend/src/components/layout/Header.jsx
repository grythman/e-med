import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import Button from '../common/Button';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            e-med
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">
              {t('navigation.courses')}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-courses" className="text-gray-700 hover:text-blue-600">
                  {t('navigation.myCourses')}
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  {t('navigation.profile')}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="small" onClick={handleLogout}>
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="small">
                    {t('auth.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="small">
                    {t('auth.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

