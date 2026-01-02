const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');

/**
 * Enrollment Repository
 * Data access layer for enrollments
 */
class EnrollmentRepository {
  /**
   * Create enrollment
   */
  async create(userId, courseId) {
    try {
      const enrollment = new Enrollment({
        userId,
        courseId
      });
      return await enrollment.save();
    } catch (error) {
      // Handle duplicate key error (already enrolled)
      if (error.code === 11000) {
        return await this.findByUserAndCourse(userId, courseId);
      }
      throw error;
    }
  }

  /**
   * Get enrollment by user and course
   */
  async findByUserAndCourse(userId, courseId) {
    return await Enrollment.findOne({
      userId,
      courseId
    });
  }

  /**
   * Get user enrollments
   */
  async findByUser(userId) {
    return await Enrollment.find({ userId })
      .populate('courseId', 'title thumbnailUrl price instructorId')
      .sort({ enrolledAt: -1 })
      .lean();
  }

  /**
   * Get course progress
   */
  async getProgress(enrollmentId) {
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('courseId')
      .lean();

    if (!enrollment) return null;

    // Get total lessons count
    const totalLessons = await Lesson.countDocuments({
      courseId: enrollment.courseId._id
    });

    // Get completed lessons count
    const completedLessons = await LessonProgress.countDocuments({
      enrollmentId,
      isCompleted: true
    });

    return {
      ...enrollment,
      totalLessons,
      completedLessons
    };
  }

  /**
   * Update progress percentage
   */
  async updateProgress(enrollmentId, progressPercentage) {
    return await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { $set: { progressPercentage } },
      { new: true }
    );
  }

  /**
   * Mark course as completed
   */
  async markCompleted(enrollmentId) {
    return await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        $set: {
          completedAt: new Date(),
          progressPercentage: 100
        }
      },
      { new: true }
    );
  }
}

module.exports = new EnrollmentRepository();
