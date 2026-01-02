const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

/**
 * Course Repository
 * Data access layer for courses
 */
class CourseRepository {
  /**
   * Get all courses with filters
   */
  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      level,
      language,
      isPublished,
      instructorId,
      search
    } = filters;

    const query = {};

    // Build query filters
    if (isPublished !== undefined) {
      query.isPublished = isPublished;
    }

    if (level) {
      query.level = level;
    }

    if (language) {
      query.language = language;
    }

    if (instructorId) {
      query.instructorId = instructorId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Course.countDocuments(query);

    // Get courses with pagination
    const courses = await Course.find(query)
      .populate('instructorId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get enrollment counts
    const courseIds = courses.map(c => c._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);

    const enrollmentMap = {};
    enrollmentCounts.forEach(item => {
      enrollmentMap[item._id.toString()] = item.count;
    });

    // Add enrollment count to each course
    const coursesWithCounts = courses.map(course => ({
      ...course,
      enrollmentCount: enrollmentMap[course._id.toString()] || 0
    }));

    return {
      courses: coursesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get course by ID
   */
  async findById(id) {
    const course = await Course.findById(id)
      .populate('instructorId', 'firstName lastName email')
      .lean();

    if (!course) return null;

    // Get enrollment count
    const enrollmentCount = await Enrollment.countDocuments({ courseId: id });
    course.enrollmentCount = enrollmentCount;

    return course;
  }

  /**
   * Create new course
   */
  async create(courseData) {
    const course = new Course({
      title: courseData.title,
      description: courseData.description,
      instructorId: courseData.instructorId,
      thumbnailUrl: courseData.thumbnailUrl,
      price: courseData.price || 0,
      durationHours: courseData.durationHours,
      level: courseData.level,
      language: courseData.language || 'mn',
      isPublished: courseData.isPublished || false
    });

    return await course.save();
  }

  /**
   * Update course
   */
  async update(id, courseData) {
    const updateData = {};

    if (courseData.title !== undefined) updateData.title = courseData.title;
    if (courseData.description !== undefined) updateData.description = courseData.description;
    if (courseData.thumbnailUrl !== undefined) updateData.thumbnailUrl = courseData.thumbnailUrl;
    if (courseData.price !== undefined) updateData.price = courseData.price;
    if (courseData.durationHours !== undefined) updateData.durationHours = courseData.durationHours;
    if (courseData.level !== undefined) updateData.level = courseData.level;
    if (courseData.language !== undefined) updateData.language = courseData.language;
    if (courseData.isPublished !== undefined) updateData.isPublished = courseData.isPublished;

    return await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

  /**
   * Delete course
   */
  async delete(id) {
    return await Course.findByIdAndDelete(id);
  }

  /**
   * Check if user is enrolled in course
   */
  async isEnrolled(userId, courseId) {
    const enrollment = await Enrollment.findOne({
      userId,
      courseId
    });
    return !!enrollment;
  }

  /**
   * Get course lessons
   */
  async getLessons(courseId) {
    const Lesson = require('../models/Lesson');
    return await Lesson.find({ courseId })
      .sort({ orderIndex: 1 })
      .lean();
  }
}

module.exports = new CourseRepository();
