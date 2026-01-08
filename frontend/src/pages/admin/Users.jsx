import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useAdminStore from '../../store/adminStore';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import UserRoleModal from '../../components/admin/UserRoleModal';
import UserDetailsModal from '../../components/admin/UserDetailsModal';

const Users = () => {
  const { t } = useTranslation();
  const {
    users,
    usersPagination,
    isLoadingUsers,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 });
  }, [fetchUsers]);

  const handleSearch = () => {
    fetchUsers({ ...filters, page: 1, limit: 10 });
  };

  const handleUpdateUser = async (userId, updates) => {
    const result = await updateUser(userId, updates);
    if (result.success) {
      toast.success('Хэрэглэгч амжилттай шинэчлэгдлээ');
      fetchUsers({ ...filters, page: usersPagination?.page || 1, limit: 10 });
    }
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success('Хэрэглэгч амжилттай устгагдлаа');
        fetchUsers({ ...filters, page: usersPagination?.page || 1, limit: 10 });
      }
    }
  };

  if (isLoadingUsers) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Хэрэглэгчид</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Хайх..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">Бүх эрх</option>
            <option value="student">Оюутан</option>
            <option value="teacher">Багш</option>
            <option value="admin">Админ</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
          >
            <option value="">Бүх статус</option>
            <option value="true">Идэвхтэй</option>
            <option value="false">Идэвхгүй</option>
          </select>
          <Button onClick={handleSearch}>Хайх</Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Нэр
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Имэйл
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Эрх
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдлүүд
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {user.firstName} {user.lastName}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleRoleChange(user)}
                    >
                      Эрх өөрчлөх
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() =>
                        handleUpdateUser(user._id || user.id, {
                          isActive: !user.isActive,
                        })
                      }
                    >
                      {user.isActive ? 'Идэвхгүй' : 'Идэвхжүүлэх'}
                    </Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleDeleteUser(user._id || user.id)}
                    >
                      Устгах
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {usersPagination && usersPagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div>
              Хуудас {usersPagination.page} / {usersPagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="small"
                disabled={usersPagination.page === 1}
                onClick={() =>
                  fetchUsers({
                    ...filters,
                    page: usersPagination.page - 1,
                    limit: 10,
                  })
                }
              >
                Өмнөх
              </Button>
              <Button
                variant="outline"
                size="small"
                disabled={usersPagination.page === usersPagination.totalPages}
                onClick={() =>
                  fetchUsers({
                    ...filters,
                    page: usersPagination.page + 1,
                    limit: 10,
                  })
                }
              >
                Дараах
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UserRoleModal
            user={selectedUser}
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            onSuccess={() => fetchUsers({ ...filters, page: usersPagination?.page || 1, limit: 10 })}
          />
          <UserDetailsModal
            userId={selectedUser._id || selectedUser.id}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default Users;

