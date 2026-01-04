const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  answerText: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  orderIndex: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);
