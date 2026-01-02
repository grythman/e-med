const certificateRepository = require('../repositories/certificateRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');

/**
 * Certificate Service
 * Business logic layer for certificates
 */
class CertificateService {
  /**
   * Generate certificate for completed course
   */
  async generateCertificate(enrollmentId, userId) {
    // Check if enrollment exists and belongs to user
    const enrollment = await enrollmentRepository.getProgress(enrollmentId);

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (enrollment.user_id !== userId) {
      throw new Error('Access denied');
    }

    // Check if course is completed
    if (!enrollment.completed_at || enrollment.progress_percentage < 100) {
      throw new Error('Course must be completed to generate certificate');
    }

    // Check if certificate already exists
    const Certificate = require('../models/Certificate');
    const existingCert = await Certificate.findOne({ enrollmentId });

    if (existingCert) {
      // Return existing certificate
      return await certificateRepository.findById(existingCert._id.toString());
    }

    // Create new certificate
    const certificate = await certificateRepository.create(enrollmentId);

    // In production, generate PDF here and upload to S3
    // For now, we'll just return the certificate data

    return certificate;
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(id, userId = null) {
    const certificate = await certificateRepository.findById(id);

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    // Check if user owns this certificate (unless admin)
    if (userId && certificate.user_id !== userId) {
      // In production, check if user is admin
      throw new Error('Access denied');
    }

    return certificate;
  }

  /**
   * Get certificate by verification code (public)
   */
  async verifyCertificate(code) {
    const certificate = await certificateRepository.findByVerificationCode(code);

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    // Return public certificate info (without sensitive data)
    return {
      certificateNumber: certificate.certificate_number,
      courseTitle: certificate.course_title,
      userName: `${certificate.user_first_name} ${certificate.user_last_name}`,
      issuedAt: certificate.issued_at,
      verificationCode: certificate.verification_code
    };
  }

  /**
   * Get user certificates
   */
  async getUserCertificates(userId) {
    return await certificateRepository.findByUser(userId);
  }

  /**
   * Download certificate PDF
   */
  async downloadCertificate(id, userId) {
    const certificate = await this.getCertificateById(id, userId);

    // In production, generate PDF if not exists and return URL
    // For now, return certificate data
    return {
      certificate,
      pdfUrl: certificate.pdf_url || null
    };
  }
}

module.exports = new CertificateService();

