import api from './api';

export const adminService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data.stats;
  },

  /**
   * Get all users
   */
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.user;
  },

  /**
   * Update user
   */
  async updateUser(id, userData) {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.user;
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Get all courses (admin view)
   */
  async getCourses(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished);

    const response = await api.get(`/admin/courses?${params.toString()}`);
    return response.data;
  },

  /**
   * Publish/unpublish course
   */
  async updateCourseStatus(id, isPublished) {
    const response = await api.put(`/admin/courses/${id}/publish`, { isPublished });
    return response.data.course;
  },

  /**
   * Delete course
   */
  async deleteCourse(id) {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  /**
   * Get all payments
   */
  async getPayments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/admin/payments?${params.toString()}`);
    return response.data;
  },
};

