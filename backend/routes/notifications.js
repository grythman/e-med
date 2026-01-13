const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { query, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const notificationService = require('../services/notificationService');

/**
 * GET /api/notifications
 * Get user notifications
 */
router.get(
  '/',
  authenticate,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('skip').optional().isInt({ min: 0 }),
    query('unreadOnly').optional().isBoolean(),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { limit = 20, skip = 0, unreadOnly = false } = req.query;
      const notifications = await notificationService.getUserNotifications(
        req.user.userId,
        {
          limit: parseInt(limit),
          skip: parseInt(skip),
          unreadOnly: unreadOnly === 'true',
        }
      );

      const unreadCount = await notificationService.getUnreadCount(req.user.userId);

      res.json({
        notifications,
        unreadCount,
        pagination: {
          limit: parseInt(limit),
          skip: parseInt(skip),
        },
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.userId);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch(
  '/:id/read',
  authenticate,
  [param('id').isMongoId(), handleValidationErrors],
  async (req, res) => {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user.userId
      );

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ notification });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', authenticate, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete notification
 */
router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId(), handleValidationErrors],
  async (req, res) => {
    try {
      const deleted = await notificationService.deleteNotification(
        req.params.id,
        req.user.userId
      );

      if (!deleted) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ message: 'Notification deleted' });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

