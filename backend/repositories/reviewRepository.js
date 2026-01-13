const Review = require('../models/Review');
const mongoose = require('mongoose');

const reviewRepository = {
  /**
   * Create review
   */
  async create(reviewData) {
    const review = new Review(reviewData);
    return await review.save();
  },

  /**
   * Find review by ID
   */
  async findById(reviewId) {
    return await Review.findById(reviewId)
      .populate('userId', 'firstName lastName')
      .populate('courseId', 'title')
      .lean();
  },

  /**
   * Find review by user and course
   */
  async findByUserAndCourse(userId, courseId) {
    return await Review.findOne({ userId, courseId })
      .populate('userId', 'firstName lastName')
      .lean();
  },

  /**
   * Find reviews by course
   */
  async findByCourse(courseId, { limit = 20, skip = 0, rating = null, sortBy = 'createdAt' } = {}) {
    const query = { courseId, isPublished: true };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const sortOptions = {
      createdAt: { createdAt: -1 },
      rating: { rating: -1, createdAt: -1 },
      helpful: { helpfulCount: -1, createdAt: -1 },
    };

    return await Review.find(query)
      .populate('userId', 'firstName lastName')
      .sort(sortOptions[sortBy] || sortOptions.createdAt)
      .limit(limit)
      .skip(skip)
      .lean();
  },

  /**
   * Find reviews by user
   */
  async findByUser(userId, { limit = 20, skip = 0 } = {}) {
    return await Review.find({ userId })
      .populate('courseId', 'title thumbnailUrl')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  },

  /**
   * Update review
   */
  async update(reviewId, userId, updateData) {
    return await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName')
      .lean();
  },

  /**
   * Delete review
   */
  async delete(reviewId, userId) {
    return await Review.findOneAndDelete({ _id: reviewId, userId });
  },

  /**
   * Get course rating statistics
   */
  async getCourseStats(courseId) {
    const stats = await Review.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId), isPublished: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    if (!stats || stats.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const stat = stats[0];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    stat.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    return {
      averageRating: Math.round(stat.averageRating * 10) / 10,
      totalReviews: stat.totalReviews,
      ratingDistribution: distribution,
    };
  },

  /**
   * Increment helpful count
   */
  async incrementHelpful(reviewId) {
    return await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
  },
};

module.exports = reviewRepository;

