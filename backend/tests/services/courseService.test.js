const courseService = require('../../services/courseService');
const courseRepository = require('../../repositories/courseRepository');

jest.mock('../../repositories/courseRepository');

describe('CourseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should filter published courses for non-admin users', async () => {
      const filters = { role: 'student' };
      const mockCourses = {
        courses: [{ title: 'Test Course' }],
        pagination: { page: 1, total: 1 },
      };

      courseRepository.findAll.mockResolvedValue(mockCourses);

      const result = await courseService.getCourses(filters);

      expect(courseRepository.findAll).toHaveBeenCalledWith({
        ...filters,
        isPublished: true,
      });
      expect(result).toEqual(mockCourses);
    });

    it('should not filter for admin users', async () => {
      const filters = { role: 'admin' };
      const mockCourses = {
        courses: [{ title: 'Test Course' }],
        pagination: { page: 1, total: 1 },
      };

      courseRepository.findAll.mockResolvedValue(mockCourses);

      const result = await courseService.getCourses(filters);

      expect(courseRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockCourses);
    });
  });

  describe('getCourseById', () => {
    it('should return course with enrollment status', async () => {
      const courseId = 'course123';
      const userId = 'user123';
      const mockCourse = { _id: courseId, title: 'Test Course' };

      courseRepository.findById.mockResolvedValue(mockCourse);
      courseRepository.isEnrolled.mockResolvedValue(true);

      const result = await courseService.getCourseById(courseId, userId);

      expect(courseRepository.findById).toHaveBeenCalledWith(courseId);
      expect(courseRepository.isEnrolled).toHaveBeenCalledWith(userId, courseId);
      expect(result.isEnrolled).toBe(true);
    });

    it('should throw error if course not found', async () => {
      courseRepository.findById.mockResolvedValue(null);

      await expect(
        courseService.getCourseById('invalid')
      ).rejects.toThrow('Course not found');
    });
  });

  describe('createCourse', () => {
    it('should create course with instructor ID', async () => {
      const courseData = { title: 'New Course' };
      const instructorId = 'instructor123';
      const mockCourse = { _id: 'course123', ...courseData };

      courseRepository.create.mockResolvedValue(mockCourse);

      const result = await courseService.createCourse(courseData, instructorId);

      expect(courseRepository.create).toHaveBeenCalledWith({
        ...courseData,
        instructorId,
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw error if title is missing', async () => {
      await expect(
        courseService.createCourse({}, 'instructor123')
      ).rejects.toThrow('Course title is required');
    });
  });
});

