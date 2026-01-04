import api from './api';

export const courseService = {
  /**
   * Get all courses with filters
   */
  async getCourses(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.level) params.append('level', filters.level);
    if (filters.language) params.append('language', filters.language);
    if (filters.search) params.append('search', filters.search);
    if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished);

    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  },

  /**
   * Get course by ID
   */
  async getCourseById(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data.course;
  },

  /**
   * Create course (admin/teacher only)
   */
  async createCourse(courseData) {
    const response = await api.post('/courses', courseData);
    return response.data.course;
  },

  /**
   * Update course (admin/teacher only)
   */
  async updateCourse(id, courseData) {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data.course;
  },

  /**
   * Delete course (admin only)
   */
  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  /**
   * Get course lessons
   */
  async getCourseLessons(courseId) {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data.lessons;
  },

  /**
   * Enroll in course
   */
  async enrollInCourse(courseId) {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  /**
   * Get course progress
   */
  async getCourseProgress(courseId) {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data.progress;
  },
};

