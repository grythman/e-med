import api from './api';

export const paymentService = {
  /**
   * Create payment
   */
  async createPayment(paymentData) {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  /**
   * Get payment by ID
   */
  async getPaymentById(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data.payment;
  },

  /**
   * Get payment history
   */
  async getPaymentHistory(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`/payments/history?${params.toString()}`);
    return response.data;
  },
};

