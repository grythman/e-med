const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String
  },
  videoDuration: {
    type: Number, // seconds
    min: 0
  },
  orderIndex: {
    type: Number,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
lessonSchema.index({ courseId: 1, orderIndex: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);


