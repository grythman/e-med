const enrollmentService = require('../../services/enrollmentService');
const enrollmentRepository = require('../../repositories/enrollmentRepository');
const courseRepository = require('../../repositories/courseRepository');
const lessonRepository = require('../../repositories/lessonRepository');

jest.mock('../../repositories/enrollmentRepository');
jest.mock('../../repositories/courseRepository');
jest.mock('../../repositories/lessonRepository');

describe('EnrollmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enrollUser', () => {
    it('should enroll user in free course', async () => {
      const mockCourse = {
        _id: 'course123',
        title: 'Free Course',
        price: 0,
        isPublished: true,
      };

      const mockEnrollment = {
        _id: 'enrollment123',
        userId: 'user123',
        courseId: 'course123',
        progressPercentage: 0,
      };

      courseRepository.findById.mockResolvedValue(mockCourse);
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(null);
      enrollmentRepository.create.mockResolvedValue(mockEnrollment);

      const result = await enrollmentService.enrollUser('user123', 'course123');

      expect(enrollmentRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockEnrollment);
    });

    it('should throw error for paid course without payment', async () => {
      const mockCourse = {
        _id: 'course123',
        price: 50000,
        isPublished: true,
      };

      courseRepository.findById.mockResolvedValue(mockCourse);
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(null);

      await expect(
        enrollmentService.enrollUser('user123', 'course123')
      ).rejects.toThrow('Payment required');
    });

    it('should throw error if already enrolled', async () => {
      const mockCourse = { _id: 'course123', price: 0, isPublished: true };
      const mockEnrollment = { _id: 'enrollment123' };

      courseRepository.findById.mockResolvedValue(mockCourse);
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(mockEnrollment);

      await expect(
        enrollmentService.enrollUser('user123', 'course123')
      ).rejects.toThrow('Already enrolled');
    });
  });

  describe('updateProgress', () => {
    it('should update lesson progress', async () => {
      const mockEnrollment = {
        _id: 'enrollment123',
        userId: 'user123',
        courseId: 'course123',
        completedLessons: [],
        progressPercentage: 0,
      };

      const mockLesson = {
        _id: 'lesson123',
        courseId: 'course123',
        order: 1,
      };

      const totalLessons = 5;

      enrollmentRepository.findByUserAndCourse.mockResolvedValue(mockEnrollment);
      lessonRepository.findById.mockResolvedValue(mockLesson);
      lessonRepository.countByCourse.mockResolvedValue(totalLessons);
      enrollmentRepository.updateProgress.mockResolvedValue({
        ...mockEnrollment,
        completedLessons: ['lesson123'],
        progressPercentage: 20,
      });

      const result = await enrollmentService.updateProgress(
        'user123',
        'course123',
        'lesson123',
        true
      );

      expect(enrollmentRepository.updateProgress).toHaveBeenCalled();
      expect(result.progressPercentage).toBe(20);
    });

    it('should throw error if not enrolled', async () => {
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(null);

      await expect(
        enrollmentService.updateProgress('user123', 'course123', 'lesson123', true)
      ).rejects.toThrow('Not enrolled');
    });
  });

  describe('completeEnrollment', () => {
    it('should mark enrollment as completed when all lessons done', async () => {
      const mockEnrollment = {
        _id: 'enrollment123',
        userId: 'user123',
        courseId: 'course123',
        completedLessons: ['lesson1', 'lesson2', 'lesson3'],
        progressPercentage: 100,
      };

      enrollmentRepository.findById.mockResolvedValue(mockEnrollment);
      lessonRepository.countByCourse.mockResolvedValue(3);
      enrollmentRepository.markComplete.mockResolvedValue({
        ...mockEnrollment,
        completedAt: new Date(),
      });

      const result = await enrollmentService.completeEnrollment('enrollment123');

      expect(enrollmentRepository.markComplete).toHaveBeenCalledWith('enrollment123');
      expect(result).toHaveProperty('completedAt');
    });

    it('should throw error if not all lessons completed', async () => {
      const mockEnrollment = {
        _id: 'enrollment123',
        courseId: 'course123',
        completedLessons: ['lesson1', 'lesson2'],
        progressPercentage: 66,
      };

      enrollmentRepository.findById.mockResolvedValue(mockEnrollment);
      lessonRepository.countByCourse.mockResolvedValue(3);

      await expect(
        enrollmentService.completeEnrollment('enrollment123')
      ).rejects.toThrow('All lessons must be completed');
    });
  });

  describe('getEnrollmentStats', () => {
    it('should return enrollment statistics', async () => {
      const mockStats = {
        totalEnrollments: 100,
        completedEnrollments: 45,
        averageProgress: 67.5,
      };

      enrollmentRepository.getStats.mockResolvedValue(mockStats);

      const result = await enrollmentService.getEnrollmentStats('course123');

      expect(enrollmentRepository.getStats).toHaveBeenCalledWith('course123');
      expect(result).toEqual(mockStats);
    });
  });
});

