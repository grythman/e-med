const userRepository = require('../repositories/userRepository');
const courseRepository = require('../repositories/courseRepository');
const paymentRepository = require('../repositories/paymentRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');

/**
 * Admin Service
 * Business logic for admin operations
 */
class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const [
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalPayments,
        activeUsers,
        publishedCourses,
        totalRevenue
      ] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Enrollment.countDocuments(),
        Payment.countDocuments({ paymentStatus: 'completed' }),
        User.countDocuments({ isActive: true }),
        Course.countDocuments({ isPublished: true }),
        Payment.aggregate([
          { $match: { paymentStatus: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);

      // Recent enrollments (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentEnrollments = await Enrollment.countDocuments({
        enrolledAt: { $gte: sevenDaysAgo }
      });

      // Recent payments (last 7 days)
      const recentPayments = await Payment.countDocuments({
        paymentStatus: 'completed',
        createdAt: { $gte: sevenDaysAgo }
      });

      return {
        users: {
          total: totalUsers,
          active: activeUsers
        },
        courses: {
          total: totalCourses,
          published: publishedCourses
        },
        enrollments: {
          total: totalEnrollments,
          recent: recentEnrollments
        },
        payments: {
          total: totalPayments,
          recent: recentPayments,
          revenue: totalRevenue[0]?.total || 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }

  /**
   * Get all users with pagination
   */
  async getUsers(filters = {}) {
    try {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      if (filters.search) {
        query.$or = [
          { email: { $regex: filters.search, $options: 'i' } },
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } }
        ];
      }
      if (filters.role) {
        query.role = filters.role;
      }
      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive === 'true';
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-passwordHash')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query)
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, userData) {
    try {
      const user = await userRepository.update(userId, userData);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error('User not found');
      }
      // Also delete related enrollments
      await Enrollment.deleteMany({ userId });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Get all courses with pagination (admin view)
   */
  async getCourses(filters = {}) {
    try {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      if (filters.isPublished !== undefined) {
        query.isPublished = filters.isPublished === 'true';
      }

      const [courses, total] = await Promise.all([
        Course.find(query)
          .populate('instructorId', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Course.countDocuments(query)
      ]);

      return {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get courses: ${error.message}`);
    }
  }

  /**
   * Update course status (publish/unpublish)
   */
  async updateCourseStatus(courseId, isPublished) {
    try {
      const course = await Course.findByIdAndUpdate(
        courseId,
        { isPublished },
        { new: true }
      );
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      throw new Error(`Failed to update course status: ${error.message}`);
    }
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId) {
    try {
      const course = await Course.findByIdAndDelete(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      // Also delete related enrollments and lessons
      await Enrollment.deleteMany({ courseId });
      return { message: 'Course deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete course: ${error.message}`);
    }
  }

  /**
   * Get all payments with pagination
   */
  async getPayments(filters = {}) {
    try {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }
      if (filters.search) {
        query.$or = [
          { transactionId: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const [payments, total] = await Promise.all([
        Payment.find(query)
          .populate('userId', 'firstName lastName email')
          .populate('courseId', 'title')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Payment.countDocuments(query)
      ]);

      return {
        payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get payments: ${error.message}`);
    }
  }
}

module.exports = new AdminService();

