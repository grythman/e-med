const courseRepository = require('../repositories/courseRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');

/**
 * Course Service
 * Business logic layer for courses
 */
class CourseService {
  /**
   * Get all courses with filters
   */
  async getCourses(filters = {}) {
    // Ensure only published courses are shown to non-admin/teacher users
    if (filters.role !== 'admin' && filters.role !== 'teacher') {
      filters.isPublished = true;
    }

    return await courseRepository.findAll(filters);
  }

  /**
   * Get course by ID
   */
  async getCourseById(id, userId = null) {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check if user is enrolled (if userId provided)
    if (userId) {
      course.isEnrolled = await courseRepository.isEnrolled(userId, id);
    }

    return course;
  }

  /**
   * Create new course
   */
  async createCourse(courseData, instructorId) {
    // Validate required fields
    if (!courseData.title) {
      throw new Error('Course title is required');
    }

    // Set instructor
    courseData.instructorId = instructorId;

    return await courseRepository.create(courseData);
  }

  /**
   * Update course
   */
  async updateCourse(id, courseData, userId, userRole) {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check permissions: only admin or course instructor can update
    if (userRole !== 'admin' && course.instructor_id !== userId) {
      throw new Error('Insufficient permissions to update this course');
    }

    return await courseRepository.update(id, courseData);
  }

  /**
   * Delete course
   */
  async deleteCourse(id, userId, userRole) {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    // Only admin can delete courses
    if (userRole !== 'admin') {
      throw new Error('Only admin can delete courses');
    }

    return await courseRepository.delete(id);
  }

  /**
   * Enroll user in course
   */
  async enrollUser(userId, courseId) {
    const course = await courseRepository.findById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await enrollmentRepository.findByUserAndCourse(userId, courseId);
    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await enrollmentRepository.create(userId, courseId);

    return {
      enrollment,
      course
    };
  }

  /**
   * Get course progress for user
   */
  async getCourseProgress(userId, courseId) {
    const enrollment = await enrollmentRepository.findByUserAndCourse(userId, courseId);

    if (!enrollment) {
      throw new Error('User is not enrolled in this course');
    }

    return await enrollmentRepository.getProgress(enrollment._id.toString());
  }

  /**
   * Get course lessons
   */
  async getCourseLessons(courseId, userId = null) {
    const course = await courseRepository.findById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    // Check if user is enrolled (for non-preview lessons)
    let isEnrolled = false;
    if (userId) {
      isEnrolled = await courseRepository.isEnrolled(userId, courseId);
    }

    const lessons = await courseRepository.getLessons(courseId);

    // Filter lessons based on enrollment
    // If not enrolled, only show preview lessons
    if (!isEnrolled && userId) {
      return lessons.filter(lesson => lesson.is_preview);
    }

    return lessons;
  }

  /**
   * Get user's enrolled courses with progress
   */
  async getUserEnrollments(userId) {
    const enrollments = await enrollmentRepository.findByUser(userId);
    
    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await enrollmentRepository.getProgress(enrollment._id.toString());
        return {
          ...enrollment,
          totalLessons: progress?.totalLessons || 0,
          completedLessons: progress?.completedLessons || 0,
          progressPercentage: progress?.totalLessons > 0 
            ? Math.round((progress.completedLessons / progress.totalLessons) * 100) 
            : 0
        };
      })
    );

    return enrollmentsWithProgress;
  }
}

module.exports = new CourseService();

