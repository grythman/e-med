const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
    index: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  isPassed: {
    type: Boolean
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
