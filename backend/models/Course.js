const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  thumbnailUrl: {
    type: String
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  durationHours: {
    type: Number,
    min: 0
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  language: {
    type: String,
    enum: ['mn', 'en'],
    default: 'mn'
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ instructorId: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ level: 1, language: 1 });

module.exports = mongoose.model('Course', courseSchema);

