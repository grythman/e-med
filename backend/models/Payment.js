const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'MNT',
    length: 3
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'qpay', 'bank_transfer']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  transactionId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);

