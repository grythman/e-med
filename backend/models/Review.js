const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  isVerified: {
    type: Boolean,
    default: false, // Only verified if user completed the course
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one review per user per course
reviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ courseId: 1, rating: 1, createdAt: -1 });
reviewSchema.index({ courseId: 1, isPublished: 1 });

// Method to check if user can review (must be enrolled and completed)
reviewSchema.methods.canReview = async function() {
  const Enrollment = require('./Enrollment');
  const enrollment = await Enrollment.findOne({
    userId: this.userId,
    courseId: this.courseId,
    completedAt: { $exists: true },
  });
  return !!enrollment;
};

module.exports = mongoose.model('Review', reviewSchema);

