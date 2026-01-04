import { create } from 'zustand';
import { adminService } from '../services/adminService';

const useAdminStore = create((set, get) => ({
  // Dashboard stats
  stats: null,
  isLoadingStats: false,

  // Users
  users: [],
  usersPagination: null,
  isLoadingUsers: false,

  // Courses
  courses: [],
  coursesPagination: null,
  isLoadingCourses: false,

  // Payments
  payments: [],
  paymentsPagination: null,
  isLoadingPayments: false,

  error: null,

  // Get dashboard stats
  fetchDashboardStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const stats = await adminService.getDashboardStats();
      set({ stats, isLoadingStats: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch dashboard stats';
      set({ error: errorMessage, isLoadingStats: false });
    }
  },

  // Get users
  fetchUsers: async (filters = {}) => {
    set({ isLoadingUsers: true, error: null });
    try {
      const data = await adminService.getUsers(filters);
      set({
        users: data.users,
        usersPagination: data.pagination,
        isLoadingUsers: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch users';
      set({ error: errorMessage, isLoadingUsers: false });
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    set({ error: null });
    try {
      const user = await adminService.updateUser(id, userData);
      // Update in local state
      set((state) => ({
        users: state.users.map((u) => (u._id === id || u.id === id ? user : u)),
      }));
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update user';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Delete user
  deleteUser: async (id) => {
    set({ error: null });
    try {
      await adminService.deleteUser(id);
      // Remove from local state
      set((state) => ({
        users: state.users.filter((u) => u._id !== id && u.id !== id),
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete user';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Get courses
  fetchCourses: async (filters = {}) => {
    set({ isLoadingCourses: true, error: null });
    try {
      const data = await adminService.getCourses(filters);
      set({
        courses: data.courses,
        coursesPagination: data.pagination,
        isLoadingCourses: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch courses';
      set({ error: errorMessage, isLoadingCourses: false });
    }
  },

  // Update course status
  updateCourseStatus: async (id, isPublished) => {
    set({ error: null });
    try {
      const course = await adminService.updateCourseStatus(id, isPublished);
      // Update in local state
      set((state) => ({
        courses: state.courses.map((c) => (c._id === id || c.id === id ? course : c)),
      }));
      return { success: true, course };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update course status';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    set({ error: null });
    try {
      await adminService.deleteCourse(id);
      // Remove from local state
      set((state) => ({
        courses: state.courses.filter((c) => c._id !== id && c.id !== id),
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete course';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Get payments
  fetchPayments: async (filters = {}) => {
    set({ isLoadingPayments: true, error: null });
    try {
      const data = await adminService.getPayments(filters);
      set({
        payments: data.payments,
        paymentsPagination: data.pagination,
        isLoadingPayments: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch payments';
      set({ error: errorMessage, isLoadingPayments: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAdminStore;

