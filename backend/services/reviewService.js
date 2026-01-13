const reviewRepository = require('../repositories/reviewRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');

class ReviewService {
  /**
   * Create review
   */
  async createReview(userId, courseId, reviewData) {
    // Check if user is enrolled and completed
    const enrollment = await enrollmentRepository.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new Error('Must be enrolled to review');
    }

    // Check if already reviewed
    const existingReview = await reviewRepository.findByUserAndCourse(userId, courseId);
    if (existingReview) {
      throw new Error('Already reviewed this course');
    }

    // Mark as verified if course is completed
    const isVerified = !!enrollment.completedAt;

    return await reviewRepository.create({
      userId,
      courseId,
      ...reviewData,
      isVerified,
    });
  }

  /**
   * Get course reviews
   */
  async getCourseReviews(courseId, options = {}) {
    return await reviewRepository.findByCourse(courseId, options);
  }

  /**
   * Get course rating statistics
   */
  async getCourseStats(courseId) {
    return await reviewRepository.getCourseStats(courseId);
  }

  /**
   * Get user reviews
   */
  async getUserReviews(userId, options = {}) {
    return await reviewRepository.findByUser(userId, options);
  }

  /**
   * Update review
   */
  async updateReview(reviewId, userId, updateData) {
    const review = await reviewRepository.update(reviewId, userId, updateData);
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId, userId) {
    const deleted = await reviewRepository.delete(reviewId, userId);
    if (!deleted) {
      throw new Error('Review not found');
    }
    return deleted;
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId) {
    return await reviewRepository.incrementHelpful(reviewId);
  }

  /**
   * Get user's review for a course
   */
  async getUserReviewForCourse(userId, courseId) {
    return await reviewRepository.findByUserAndCourse(userId, courseId);
  }
}

module.exports = new ReviewService();

