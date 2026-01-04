import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAdminStore from '../../store/adminStore';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Payments = () => {
  const { t } = useTranslation();
  const {
    payments,
    paymentsPagination,
    isLoadingPayments,
    error,
    fetchPayments,
  } = useAdminStore();

  const [filters, setFilters] = useState({
    search: '',
    paymentStatus: '',
  });

  useEffect(() => {
    fetchPayments({ page: 1, limit: 10 });
  }, [fetchPayments]);

  const handleSearch = () => {
    fetchPayments({ ...filters, page: 1, limit: 10 });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Дууссан';
      case 'pending':
        return 'Хүлээгдэж байна';
      case 'failed':
        return 'Амжилтгүй';
      default:
        return status;
    }
  };

  if (isLoadingPayments) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Төлбөрүүд</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Хайх..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          >
            <option value="">Бүх статус</option>
            <option value="completed">Дууссан</option>
            <option value="pending">Хүлээгдэж байна</option>
            <option value="failed">Амжилтгүй</option>
          </select>
          <Button onClick={handleSearch}>Хайх</Button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Хэрэглэгч
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Хичээл
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дүн
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Гүйлгээний ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Огноо
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id || payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.userId
                    ? `${payment.userId.firstName} ${payment.userId.lastName}`
                    : 'Тодорхойгүй'}
                  <div className="text-sm text-gray-500">{payment.userId?.email}</div>
                </td>
                <td className="px-6 py-4">
                  {payment.courseId?.title || 'Тодорхойгүй'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat('mn-MN', {
                    style: 'currency',
                    currency: payment.currency || 'MNT',
                    minimumFractionDigits: 0,
                  }).format(payment.amount || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      payment.paymentStatus
                    )}`}
                  >
                    {getStatusText(payment.paymentStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.transactionId || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString('mn-MN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {paymentsPagination && paymentsPagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div>
              Хуудас {paymentsPagination.page} / {paymentsPagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="small"
                disabled={paymentsPagination.page === 1}
                onClick={() =>
                  fetchPayments({
                    ...filters,
                    page: paymentsPagination.page - 1,
                    limit: 10,
                  })
                }
              >
                Өмнөх
              </Button>
              <Button
                variant="outline"
                size="small"
                disabled={paymentsPagination.page === paymentsPagination.totalPages}
                onClick={() =>
                  fetchPayments({
                    ...filters,
                    page: paymentsPagination.page + 1,
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
    </div>
  );
};

export default Payments;

