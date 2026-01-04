const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
    index: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  watchedDuration: {
    type: Number,
    default: 0,
    min: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

lessonProgressSchema.index({ enrollmentId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
