const paymentService = require('../../services/paymentService');
const paymentRepository = require('../../repositories/paymentRepository');
const enrollmentRepository = require('../../repositories/enrollmentRepository');
const courseRepository = require('../../repositories/courseRepository');

jest.mock('../../repositories/paymentRepository');
jest.mock('../../repositories/enrollmentRepository');
jest.mock('../../repositories/courseRepository');

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    const paymentData = {
      userId: 'user123',
      courseId: 'course123',
      amount: 50000,
      currency: 'MNT',
      paymentMethod: 'qpay',
    };

    it('should create payment successfully', async () => {
      const mockCourse = {
        _id: 'course123',
        title: 'Test Course',
        price: 50000,
        isPublished: true,
      };

      const mockPayment = {
        _id: 'payment123',
        ...paymentData,
        status: 'pending',
      };

      courseRepository.findById.mockResolvedValue(mockCourse);
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(null);
      paymentRepository.create.mockResolvedValue(mockPayment);

      const result = await paymentService.createPayment(paymentData);

      expect(courseRepository.findById).toHaveBeenCalledWith(paymentData.courseId);
      expect(enrollmentRepository.findByUserAndCourse).toHaveBeenCalledWith(
        paymentData.userId,
        paymentData.courseId
      );
      expect(paymentRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('payment');
    });

    it('should throw error if course not found', async () => {
      courseRepository.findById.mockResolvedValue(null);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow(
        'Course not found'
      );
    });

    it('should throw error if already enrolled', async () => {
      const mockCourse = { _id: 'course123', price: 50000, isPublished: true };
      const mockEnrollment = { _id: 'enrollment123' };

      courseRepository.findById.mockResolvedValue(mockCourse);
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(mockEnrollment);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow(
        'Already enrolled in this course'
      );
    });

    it('should throw error if amount does not match course price', async () => {
      const mockCourse = { _id: 'course123', price: 100000, isPublished: true };

      courseRepository.findById.mockResolvedValue(mockCourse);
      enrollmentRepository.findByUserAndCourse.mockResolvedValue(null);

      await expect(paymentService.createPayment(paymentData)).rejects.toThrow(
        'Invalid payment amount'
      );
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment and create enrollment', async () => {
      const mockPayment = {
        _id: 'payment123',
        userId: 'user123',
        courseId: 'course123',
        status: 'pending',
      };

      const mockEnrollment = {
        _id: 'enrollment123',
        userId: 'user123',
        courseId: 'course123',
      };

      paymentRepository.findById.mockResolvedValue(mockPayment);
      paymentRepository.updateStatus.mockResolvedValue({ ...mockPayment, status: 'completed' });
      enrollmentRepository.create.mockResolvedValue(mockEnrollment);

      const result = await paymentService.confirmPayment('payment123');

      expect(paymentRepository.updateStatus).toHaveBeenCalledWith('payment123', 'completed');
      expect(enrollmentRepository.create).toHaveBeenCalled();
      expect(result.payment.status).toBe('completed');
    });

    it('should throw error if payment not found', async () => {
      paymentRepository.findById.mockResolvedValue(null);

      await expect(paymentService.confirmPayment('invalid')).rejects.toThrow(
        'Payment not found'
      );
    });

    it('should throw error if payment already completed', async () => {
      const mockPayment = {
        _id: 'payment123',
        status: 'completed',
      };

      paymentRepository.findById.mockResolvedValue(mockPayment);

      await expect(paymentService.confirmPayment('payment123')).rejects.toThrow(
        'Payment already processed'
      );
    });
  });

  describe('getUserPayments', () => {
    it('should return user payments', async () => {
      const mockPayments = [
        { _id: 'payment1', amount: 50000 },
        { _id: 'payment2', amount: 30000 },
      ];

      paymentRepository.findByUser.mockResolvedValue(mockPayments);

      const result = await paymentService.getUserPayments('user123');

      expect(paymentRepository.findByUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockPayments);
    });
  });

  describe('refundPayment', () => {
    it('should refund payment successfully', async () => {
      const mockPayment = {
        _id: 'payment123',
        userId: 'user123',
        courseId: 'course123',
        status: 'completed',
        amount: 50000,
      };

      paymentRepository.findById.mockResolvedValue(mockPayment);
      paymentRepository.updateStatus.mockResolvedValue({ ...mockPayment, status: 'refunded' });
      enrollmentRepository.deleteByUserAndCourse.mockResolvedValue(true);

      const result = await paymentService.refundPayment('payment123');

      expect(paymentRepository.updateStatus).toHaveBeenCalledWith('payment123', 'refunded');
      expect(enrollmentRepository.deleteByUserAndCourse).toHaveBeenCalled();
      expect(result.status).toBe('refunded');
    });

    it('should throw error if payment not refundable', async () => {
      const mockPayment = {
        _id: 'payment123',
        status: 'pending',
      };

      paymentRepository.findById.mockResolvedValue(mockPayment);

      await expect(paymentService.refundPayment('payment123')).rejects.toThrow(
        'Payment cannot be refunded'
      );
    });
  });
});

