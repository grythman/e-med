const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminService = require('../services/adminService');
const { body, validationResult } = require('express-validator');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

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
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/users
 * Get all users with pagination and filters
 */
router.get('/users', async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      role: req.query.role,
      isActive: req.query.isActive
    };
    const result = await adminService.getUsers(filters);
    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/users/:id
 * Get user by ID
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(404).json({ error: error.message });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user
 */
router.put('/users/:id', [
  body('firstName').optional().trim().isLength({ min: 2, max: 100 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().trim(),
  body('role').optional().isIn(['student', 'teacher', 'admin']),
  body('isActive').optional().isBoolean(),
  handleValidationErrors
], async (req, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/admin/courses
 * Get all courses (admin view)
 */
router.get('/courses', async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      isPublished: req.query.isPublished
    };
    const result = await adminService.getCourses(filters);
    res.json(result);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/admin/courses/:id/publish
 * Publish/unpublish course
 */
router.put('/courses/:id/publish', [
  body('isPublished').isBoolean(),
  handleValidationErrors
], async (req, res) => {
  try {
    const course = await adminService.updateCourseStatus(
      req.params.id,
      req.body.isPublished
    );
    res.json({ course });
  } catch (error) {
    console.error('Update course status error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/courses/:id
 * Delete course
 */
router.delete('/courses/:id', async (req, res) => {
  try {
    const result = await adminService.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/admin/payments
 * Get all payments with pagination
 */
router.get('/payments', async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      paymentStatus: req.query.paymentStatus,
      search: req.query.search
    };
    const result = await adminService.getPayments(filters);
    res.json(result);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/analytics/revenue
 * Get revenue analytics (monthly)
 */
router.get('/analytics/revenue', async (req, res) => {
  try {
    const analytics = await adminService.getRevenueAnalytics();
    res.json({ analytics });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/analytics/enrollments
 * Get enrollment analytics
 */
router.get('/analytics/enrollments', async (req, res) => {
  try {
    const analytics = await adminService.getEnrollmentAnalytics();
    res.json({ analytics });
  } catch (error) {
    console.error('Enrollment analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/analytics/popular-courses
 * Get popular courses
 */
router.get('/analytics/popular-courses', async (req, res) => {
  try {
    const courses = await adminService.getPopularCourses();
    res.json({ courses });
  } catch (error) {
    console.error('Popular courses error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

