import api from './api';

export const lessonService = {
  /**
   * Get lesson by ID
   */
  async getLessonById(id) {
    const response = await api.get(`/lessons/${id}`);
    return response.data.lesson;
  },

  /**
   * Get video URL
   */
  async getVideoUrl(lessonId) {
    const response = await api.get(`/lessons/${lessonId}/video`);
    return response.data;
  },

  /**
   * Update lesson progress
   */
  async updateProgress(lessonId, progressData) {
    const response = await api.put(`/lessons/${lessonId}/progress`, progressData);
    return response.data.progress;
  },

  /**
   * Get lesson quiz
   */
  async getQuiz(lessonId) {
    const response = await api.get(`/lessons/${lessonId}/quiz`);
    return response.data.quiz;
  },

  /**
   * Submit quiz attempt
   */
  async submitQuiz(lessonId, answers) {
    const response = await api.post(`/lessons/${lessonId}/quiz/attempt`, { answers });
    return response.data;
  },
};

