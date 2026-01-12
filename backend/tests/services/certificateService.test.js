const certificateService = require('../../services/certificateService');
const certificateRepository = require('../../repositories/certificateRepository');
const enrollmentRepository = require('../../repositories/enrollmentRepository');

jest.mock('../../repositories/certificateRepository');
jest.mock('../../repositories/enrollmentRepository');

describe('CertificateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCertificate', () => {
    it('should generate certificate for completed enrollment', async () => {
      const mockEnrollment = {
        _id: 'enrollment123',
        userId: 'user123',
        courseId: 'course123',
        completedAt: new Date(),
        progressPercentage: 100,
      };

      const mockCertificate = {
        _id: 'cert123',
        userId: 'user123',
        courseId: 'course123',
        enrollmentId: 'enrollment123',
        certificateNumber: 'CERT-2024-001',
        verificationCode: 'ABC123XYZ',
        issuedAt: new Date(),
      };

      enrollmentRepository.findById.mockResolvedValue(mockEnrollment);
      certificateRepository.findByEnrollment.mockResolvedValue(null);
      certificateRepository.create.mockResolvedValue(mockCertificate);

      const result = await certificateService.generateCertificate('enrollment123');

      expect(enrollmentRepository.findById).toHaveBeenCalledWith('enrollment123');
      expect(certificateRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('certificateNumber');
      expect(result).toHaveProperty('verificationCode');
    });

    it('should throw error if enrollment not completed', async () => {
      const mockEnrollment = {
        _id: 'enrollment123',
        completedAt: null,
        progressPercentage: 80,
      };

      enrollmentRepository.findById.mockResolvedValue(mockEnrollment);

      await expect(
        certificateService.generateCertificate('enrollment123')
      ).rejects.toThrow('Course not completed');
    });

    it('should throw error if certificate already exists', async () => {
      const mockEnrollment = {
        _id: 'enrollment123',
        completedAt: new Date(),
        progressPercentage: 100,
      };

      const existingCert = { _id: 'cert123' };

      enrollmentRepository.findById.mockResolvedValue(mockEnrollment);
      certificateRepository.findByEnrollment.mockResolvedValue(existingCert);

      await expect(
        certificateService.generateCertificate('enrollment123')
      ).rejects.toThrow('Certificate already issued');
    });
  });

  describe('verifyCertificate', () => {
    it('should verify valid certificate', async () => {
      const mockCertificate = {
        _id: 'cert123',
        certificateNumber: 'CERT-2024-001',
        verificationCode: 'ABC123XYZ',
        userId: {
          firstName: 'Test',
          lastName: 'User',
        },
        courseId: {
          title: 'Test Course',
        },
        issuedAt: new Date(),
      };

      certificateRepository.findByVerificationCode.mockResolvedValue(mockCertificate);

      const result = await certificateService.verifyCertificate('ABC123XYZ');

      expect(certificateRepository.findByVerificationCode).toHaveBeenCalledWith('ABC123XYZ');
      expect(result.isValid).toBe(true);
      expect(result.certificate).toHaveProperty('certificateNumber');
    });

    it('should return invalid for non-existent certificate', async () => {
      certificateRepository.findByVerificationCode.mockResolvedValue(null);

      const result = await certificateService.verifyCertificate('INVALID');

      expect(result.isValid).toBe(false);
      expect(result.certificate).toBeNull();
    });
  });

  describe('getUserCertificates', () => {
    it('should return user certificates', async () => {
      const mockCertificates = [
        { _id: 'cert1', courseId: { title: 'Course 1' } },
        { _id: 'cert2', courseId: { title: 'Course 2' } },
      ];

      certificateRepository.findByUser.mockResolvedValue(mockCertificates);

      const result = await certificateService.getUserCertificates('user123');

      expect(certificateRepository.findByUser).toHaveBeenCalledWith('user123');
      expect(result).toHaveLength(2);
    });
  });

  describe('getCertificateById', () => {
    it('should return certificate by ID', async () => {
      const mockCertificate = {
        _id: 'cert123',
        userId: 'user123',
        courseId: { title: 'Test Course' },
      };

      certificateRepository.findById.mockResolvedValue(mockCertificate);

      const result = await certificateService.getCertificateById('cert123', 'user123');

      expect(certificateRepository.findById).toHaveBeenCalledWith('cert123');
      expect(result).toEqual(mockCertificate);
    });

    it('should throw error if certificate not found', async () => {
      certificateRepository.findById.mockResolvedValue(null);

      await expect(
        certificateService.getCertificateById('invalid', 'user123')
      ).rejects.toThrow('Certificate not found');
    });

    it('should throw error if user does not own certificate', async () => {
      const mockCertificate = {
        _id: 'cert123',
        userId: 'otherUser',
      };

      certificateRepository.findById.mockResolvedValue(mockCertificate);

      await expect(
        certificateService.getCertificateById('cert123', 'user123')
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('generatePDF', () => {
    it('should generate PDF for certificate', async () => {
      const mockCertificate = {
        _id: 'cert123',
        userId: { firstName: 'Test', lastName: 'User' },
        courseId: { title: 'Test Course' },
        certificateNumber: 'CERT-2024-001',
        issuedAt: new Date(),
      };

      certificateRepository.findById.mockResolvedValue(mockCertificate);

      const result = await certificateService.generatePDF('cert123');

      expect(result).toHaveProperty('pdfUrl');
    });
  });
});

