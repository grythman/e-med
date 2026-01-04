const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    index: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer'],
    required: true
  },
  orderIndex: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    default: 1,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
