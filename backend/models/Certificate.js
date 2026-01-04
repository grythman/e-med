const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
    index: true
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  pdfUrl: {
    type: String
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
