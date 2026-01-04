const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const lessonService = require('../services/lessonService');
const { authenticate } = require('../middleware/auth');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * GET /api/lessons/:id
 * Get lesson details
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(
      req.params.id,
      req.user.userId
    );
    res.json({ lesson });
  } catch (error) {
    if (error.message === 'Lesson not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Access denied') || error.message.includes('Authentication required')) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/lessons/:id/video
 * Get video URL (with access control)
 */
router.get('/:id/video', authenticate, async (req, res) => {
  try {
    const videoData = await lessonService.getVideoUrl(
      req.params.id,
      req.user.userId
    );
    res.json(videoData);
  } catch (error) {
    if (error.message === 'Lesson not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Access denied') || error.message.includes('Authentication required')) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get video URL error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/lessons/:id/progress
 * Update lesson progress
 */
router.put(
  '/:id/progress',
  authenticate,
  [
    body('watchedDuration').optional().isInt({ min: 0 }),
    body('isCompleted').optional().isBoolean(),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const progress = await lessonService.updateProgress(
        req.params.id,
        req.user.userId,
        req.body
      );
      res.json({ progress });
    } catch (error) {
      if (error.message === 'Lesson not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('not enrolled')) {
        return res.status(403).json({ error: error.message });
      }
      console.error('Update progress error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/lessons/:id/quiz
 * Get lesson quiz
 */
router.get('/:id/quiz', authenticate, async (req, res) => {
  try {
    const quiz = await lessonService.getQuiz(
      req.params.id,
      req.user.userId
    );
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found for this lesson' });
    }

    res.json({ quiz });
  } catch (error) {
    if (error.message === 'Lesson not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('not enrolled') || error.message.includes('Access denied')) {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/lessons/:id/quiz/attempt
 * Submit quiz attempt
 */
router.post(
  '/:id/quiz/attempt',
  authenticate,
  [
    body('answers')
      .isObject()
      .withMessage('Answers must be an object with question IDs as keys'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const result = await lessonService.submitQuizAttempt(
        req.params.id,
        req.user.userId,
        req.body.answers
      );
      res.json(result);
    } catch (error) {
      if (error.message === 'Lesson not found' || error.message === 'Quiz not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('not enrolled')) {
        return res.status(403).json({ error: error.message });
      }
      console.error('Submit quiz error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;


