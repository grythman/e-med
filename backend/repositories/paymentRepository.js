const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');

/**
 * Payment Repository
 * Data access layer for payments
 */
class PaymentRepository {
  /**
   * Create payment
   */
  async create(paymentData) {
    const payment = new Payment({
      userId: paymentData.userId,
      courseId: paymentData.courseId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'MNT',
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId
    });

    return await payment.save();
  }

  /**
   * Find payment by ID
   */
  async findById(id) {
    return await Payment.findById(id)
      .populate('courseId', 'title')
      .populate('userId', 'email')
      .lean();
  }

  /**
   * Find payment by transaction ID
   */
  async findByTransactionId(transactionId) {
    return await Payment.findOne({ transactionId });
  }

  /**
   * Update payment status
   */
  async updateStatus(id, status, transactionId = null) {
    const updateData = {
      paymentStatus: status
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    return await Payment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

  /**
   * Get user payment history
   */
  async findByUser(userId, filters = {}) {
    const { page = 1, limit = 10, status } = filters;

    const query = { userId };

    if (status) {
      query.paymentStatus = status;
    }

    // Get total count
    const total = await Payment.countDocuments(query);

    // Get payments
    const payments = await Payment.find(query)
      .populate('courseId', 'title thumbnailUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new PaymentRepository();
