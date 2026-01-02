const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const crypto = require('crypto');

/**
 * Certificate Repository
 * Data access layer for certificates
 */
class CertificateRepository {
  /**
   * Generate unique certificate number
   */
  generateCertificateNumber() {
    const prefix = 'EMED';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Generate verification code
   */
  generateVerificationCode() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Create certificate
   */
  async create(enrollmentId) {
    const certificateNumber = this.generateCertificateNumber();
    const verificationCode = this.generateVerificationCode();

    const certificate = new Certificate({
      enrollmentId,
      certificateNumber,
      verificationCode
    });

    return await certificate.save();
  }

  /**
   * Find certificate by ID
   */
  async findById(id) {
    return await Certificate.findById(id)
      .populate({
        path: 'enrollmentId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'enrollmentId',
        populate: {
          path: 'courseId',
          select: 'title'
        }
      })
      .lean();
  }

  /**
   * Find certificate by verification code
   */
  async findByVerificationCode(code) {
    const certificate = await Certificate.findOne({ verificationCode: code })
      .populate({
        path: 'enrollmentId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'enrollmentId',
        populate: {
          path: 'courseId',
          select: 'title'
        }
      })
      .lean();

    if (!certificate) return null;

    // Format for public view
    return {
      certificateNumber: certificate.certificateNumber,
      courseTitle: certificate.enrollmentId.courseId.title,
      userName: `${certificate.enrollmentId.userId.firstName} ${certificate.enrollmentId.userId.lastName}`,
      issuedAt: certificate.issuedAt,
      verificationCode: certificate.verificationCode
    };
  }

  /**
   * Find certificates by user
   */
  async findByUser(userId) {
    // Get user enrollments
    const enrollments = await Enrollment.find({ userId }).select('_id');
    const enrollmentIds = enrollments.map(e => e._id);

    return await Certificate.find({ enrollmentId: { $in: enrollmentIds } })
      .populate({
        path: 'enrollmentId',
        populate: {
          path: 'courseId',
          select: 'title thumbnailUrl'
        }
      })
      .sort({ issuedAt: -1 })
      .lean();
  }

  /**
   * Update certificate PDF URL
   */
  async updatePdfUrl(id, pdfUrl) {
    return await Certificate.findByIdAndUpdate(
      id,
      { $set: { pdfUrl } },
      { new: true }
    );
  }
}

module.exports = new CertificateRepository();
