import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../common/Loading';
import Button from '../common/Button';

const UserDetailsModal = ({ userId, isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUser();
    }
  }, [isOpen, userId]);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await adminService.getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Хэрэглэгчийн дэлгэрэнгүй</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <Loading />
        ) : user ? (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Нэр</label>
                <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Имэйл</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Утас</label>
                <p className="text-gray-900">{user.phone || 'Тодорхойгүй'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Эрх</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'admin' ? 'Админ' :
                   user.role === 'teacher' ? 'Багш' :
                   'Оюутан'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Статус</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Бүртгүүлсэн огноо</label>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('mn-MN')}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            {user.bio && (
              <div>
                <label className="text-sm font-medium text-gray-500">Товч танилцуулга</label>
                <p className="text-gray-900">{user.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Хэрэглэгч олдсонгүй</p>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Хаах
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

