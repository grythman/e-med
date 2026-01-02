const paymentRepository = require('../repositories/paymentRepository');
const courseRepository = require('../repositories/courseRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');

/**
 * Payment Service
 * Business logic layer for payments
 */
class PaymentService {
  /**
   * Create payment
   */
  async createPayment(paymentData, userId) {
    const { courseId, amount, currency, paymentMethod } = paymentData;

    // Validate course exists
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const isEnrolled = await courseRepository.isEnrolled(userId, courseId);
    if (isEnrolled) {
      throw new Error('User is already enrolled in this course');
    }

    // Validate amount matches course price
    if (amount !== parseFloat(course.price)) {
      throw new Error('Payment amount does not match course price');
    }

    // Create payment record
    const payment = await paymentRepository.create({
      userId,
      courseId,
      amount,
      currency,
      paymentMethod
    });

    return payment;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id, userId = null) {
    const payment = await paymentRepository.findById(id);

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Check if user owns this payment (unless admin)
    if (userId && payment.user_id !== userId) {
      // In production, check if user is admin
      throw new Error('Access denied');
    }

    return payment;
  }

  /**
   * Update payment status (for webhooks)
   */
  async updatePaymentStatus(transactionId, status, paymentId = null) {
    let payment;

    if (paymentId) {
      payment = await paymentRepository.findById(paymentId);
    } else {
      payment = await paymentRepository.findByTransactionId(transactionId);
    }

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update status
    const updatedPayment = await paymentRepository.updateStatus(
      payment._id.toString(),
      status,
      transactionId
    );

    // If payment completed, enroll user in course
    if (status === 'completed' && payment.payment_status !== 'completed') {
      try {
        await enrollmentRepository.create(payment.user_id, payment.course_id);
      } catch (error) {
        // Enrollment might already exist, log but don't fail
        console.error('Auto-enrollment error:', error);
      }
    }

    return updatedPayment;
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId, filters = {}) {
    return await paymentRepository.findByUser(userId, filters);
  }

  /**
   * Verify webhook signature (for Stripe/QPay)
   */
  async verifyWebhookSignature(signature, payload, secret) {
    // This is a placeholder - implement based on payment gateway
    // For Stripe: use stripe.webhooks.constructEvent()
    // For QPay: verify HMAC signature
    return true;
  }
}

module.exports = new PaymentService();

