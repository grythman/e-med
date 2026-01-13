const Notification = require('../models/Notification');

const notificationRepository = {
  /**
   * Create notification
   */
  async create(notificationData) {
    const notification = new Notification(notificationData);
    return await notification.save();
  },

  /**
   * Get user notifications
   */
  async findByUser(userId, { limit = 20, skip = 0, unreadOnly = false } = {}) {
    const query = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    return await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return await Notification.countDocuments({
      userId,
      isRead: false,
    });
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  },

  /**
   * Mark all as read
   */
  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  },

  /**
   * Delete notification
   */
  async delete(notificationId, userId) {
    return await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });
  },

  /**
   * Delete old notifications (older than 90 days)
   */
  async deleteOld(olderThanDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    });
  },
};

module.exports = notificationRepository;

