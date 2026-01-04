import { create } from 'zustand';
import { courseService } from '../services/courseService';

const useCourseStore = create((set, get) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    limit: 10,
    level: null,
    language: null,
    search: null,
  },

  // Get courses
  fetchCourses: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const data = await courseService.getCourses(currentFilters);
      set({
        courses: data.courses,
        pagination: data.pagination,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch courses';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Get course by ID
  fetchCourseById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const course = await courseService.getCourseById(id);
      set({ currentCourse: course, isLoading: false });
      return course;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch course';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Enroll in course
  enrollInCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      await courseService.enrollInCourse(courseId);
      // Refresh course data
      await get().fetchCourseById(courseId);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Enrollment failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset
  reset: () => set({
    courses: [],
    currentCourse: null,
    error: null,
    pagination: null,
  }),
}));

export default useCourseStore;

