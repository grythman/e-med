const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const reviewService = require('../services/reviewService');

/**
 * POST /api/reviews
 * Create review
 */
router.post(
  '/',
  authenticate,
  [
    body('courseId').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().isString().trim().isLength({ max: 200 }),
    body('comment').optional().isString().trim().isLength({ max: 2000 }),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const review = await reviewService.createReview(
        req.user.userId,
        req.body.courseId,
        {
          rating: req.body.rating,
          title: req.body.title,
          comment: req.body.comment,
        }
      );

      res.status(201).json({ review });
    } catch (error) {
      console.error('Create review error:', error);
      if (error.message === 'Must be enrolled to review' || error.message === 'Already reviewed this course') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/reviews/course/:courseId
 * Get course reviews
 */
router.get(
  '/course/:courseId',
  [
    param('courseId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('skip').optional().isInt({ min: 0 }),
    query('rating').optional().isInt({ min: 1, max: 5 }),
    query('sortBy').optional().isIn(['createdAt', 'rating', 'helpful']),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { limit = 20, skip = 0, rating, sortBy = 'createdAt' } = req.query;
      const reviews = await reviewService.getCourseReviews(req.params.courseId, {
        limit: parseInt(limit),
        skip: parseInt(skip),
        rating: rating ? parseInt(rating) : null,
        sortBy,
      });

      const stats = await reviewService.getCourseStats(req.params.courseId);

      res.json({ reviews, stats });
    } catch (error) {
      console.error('Get course reviews error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/reviews/course/:courseId/stats
 * Get course rating statistics
 */
router.get(
  '/course/:courseId/stats',
  [param('courseId').isMongoId(), handleValidationErrors],
  async (req, res) => {
    try {
      const stats = await reviewService.getCourseStats(req.params.courseId);
      res.json({ stats });
    } catch (error) {
      console.error('Get course stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/reviews/my
 * Get user's reviews
 */
router.get(
  '/my',
  authenticate,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('skip').optional().isInt({ min: 0 }),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { limit = 20, skip = 0 } = req.query;
      const reviews = await reviewService.getUserReviews(req.user.userId, {
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

      res.json({ reviews });
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/reviews/course/:courseId/my
 * Get user's review for specific course
 */
router.get(
  '/course/:courseId/my',
  authenticate,
  [param('courseId').isMongoId(), handleValidationErrors],
  async (req, res) => {
    try {
      const review = await reviewService.getUserReviewForCourse(
        req.user.userId,
        req.params.courseId
      );

      res.json({ review });
    } catch (error) {
      console.error('Get user review error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * PUT /api/reviews/:id
 * Update review
 */
router.put(
  '/:id',
  authenticate,
  [
    param('id').isMongoId(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('title').optional().isString().trim().isLength({ max: 200 }),
    body('comment').optional().isString().trim().isLength({ max: 2000 }),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const review = await reviewService.updateReview(
        req.params.id,
        req.user.userId,
        req.body
      );

      res.json({ review });
    } catch (error) {
      console.error('Update review error:', error);
      if (error.message === 'Review not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * DELETE /api/reviews/:id
 * Delete review
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId(), handleValidationErrors],
  async (req, res) => {
    try {
      await reviewService.deleteReview(req.params.id, req.user.userId);
      res.json({ message: 'Review deleted' });
    } catch (error) {
      console.error('Delete review error:', error);
      if (error.message === 'Review not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/reviews/:id/helpful
 * Mark review as helpful
 */
router.post(
  '/:id/helpful',
  [param('id').isMongoId(), handleValidationErrors],
  async (req, res) => {
    try {
      const review = await reviewService.markHelpful(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json({ review });
    } catch (error) {
      console.error('Mark helpful error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

