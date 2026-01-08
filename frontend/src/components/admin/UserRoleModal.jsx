import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';

const UserRoleModal = ({ user, isOpen, onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'student');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateUser(user._id || user.id, { role: selectedRole });
      toast.success('Хэрэглэгчийн эрх амжилттай шинэчлэгдлээ');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Эрх өөрчлөх</h2>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            <strong>{user.firstName} {user.lastName}</strong>
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Эрх сонгох
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="student">Оюутан</option>
            <option value="teacher">Багш</option>
            <option value="admin">Админ</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Цуцлах
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleModal;

