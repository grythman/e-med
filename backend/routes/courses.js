const express = require('express');
const router = express.Router();
const { body, query: queryValidator, validationResult } = require('express-validator');
const courseService = require('../services/courseService');
const { authenticate, authorize } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

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
 * GET /api/courses
 * List courses with filters
 */
router.get(
  '/',
  cacheMiddleware(300), // Cache for 5 minutes
  [
    queryValidator('page').optional().isInt({ min: 1 }),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
    queryValidator('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    queryValidator('language').optional().isIn(['mn', 'en']),
    queryValidator('isPublished').optional().isBoolean(),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        level: req.query.level,
        language: req.query.language,
        isPublished: req.query.isPublished !== undefined 
          ? req.query.isPublished === 'true' 
          : undefined,
        instructorId: req.query.instructorId,
        search: req.query.search,
        role: req.user?.role // Pass user role if authenticated
      };

      const result = await courseService.getCourses(filters);
      res.json(result);
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/courses/user/enrolled
 * Get user's enrolled courses (must be before /:id route)
 */
router.get('/user/enrolled', authenticate, async (req, res) => {
  try {
    const enrollments = await courseService.getUserEnrollments(req.user.userId);
    res.json({ enrollments });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/courses/:id
 * Get course details
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await courseService.getCourseById(
      req.params.id,
      req.user?.userId
    );
    res.json({ course });
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/courses
 * Create new course (admin/teacher only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be between 3 and 255 characters'),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('durationHours').optional().isInt({ min: 0 }),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('language').optional().isIn(['mn', 'en']),
    body('isPublished').optional().isBoolean(),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const course = await courseService.createCourse(
        req.body,
        req.user.userId
      );
      // Invalidate courses cache
      await invalidateCache('cache:/api/courses*');
      res.status(201).json({ course });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(400).json({ error: error.message || 'Failed to create course' });
    }
  }
);

/**
 * PUT /api/courses/:id
 * Update course (admin/teacher only)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'teacher'),
  [
    body('title').optional().trim().isLength({ min: 3, max: 255 }),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('durationHours').optional().isInt({ min: 0 }),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('language').optional().isIn(['mn', 'en']),
    body('isPublished').optional().isBoolean(),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const course = await courseService.updateCourse(
        req.params.id,
        req.body,
        req.user.userId,
        req.user.role
      );
      res.json({ course });
    } catch (error) {
      if (error.message === 'Course not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('permissions')) {
        return res.status(403).json({ error: error.message });
      }
      console.error('Update course error:', error);
      res.status(400).json({ error: error.message || 'Failed to update course' });
    }
  }
);

/**
 * DELETE /api/courses/:id
 * Delete course (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      await courseService.deleteCourse(
        req.params.id,
        req.user.userId,
        req.user.role
      );
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      if (error.message === 'Course not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('permissions')) {
        return res.status(403).json({ error: error.message });
      }
      console.error('Delete course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/courses/:id/lessons
 * Get course lessons
 */
router.get('/:id/lessons', authenticate, async (req, res) => {
  try {
    const lessons = await courseService.getCourseLessons(
      req.params.id,
      req.user.userId
    );
    res.json({ lessons });
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Get course lessons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/courses/:id/enroll
 * Enroll in course
 */
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const result = await courseService.enrollUser(
      req.user.userId,
      req.params.id
    );
    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment: result.enrollment,
      course: result.course
    });
  } catch (error) {
    if (error.message === 'Course not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already enrolled')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/courses/:id/progress
 * Get course progress
 */
router.get('/:id/progress', authenticate, async (req, res) => {
  try {
    const progress = await courseService.getCourseProgress(
      req.user.userId,
      req.params.id
    );
    res.json({ progress });
  } catch (error) {
    if (error.message.includes('not enrolled')) {
      return res.status(404).json({ error: error.message });
    }
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


