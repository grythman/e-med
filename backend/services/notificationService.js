const notificationRepository = require('../repositories/notificationRepository');

class NotificationService {
  /**
   * Create and send notification
   */
  async createNotification(userId, notificationData) {
    return await notificationRepository.create({
      userId,
      ...notificationData,
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, options = {}) {
    return await notificationRepository.findByUser(userId, options);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    return await notificationRepository.getUnreadCount(userId);
  }

  /**
   * Mark as read
   */
  async markAsRead(notificationId, userId) {
    return await notificationRepository.markAsRead(notificationId, userId);
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId) {
    return await notificationRepository.markAllAsRead(userId);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    return await notificationRepository.delete(notificationId, userId);
  }

  /**
   * Create enrollment notification
   */
  async notifyEnrollment(userId, course) {
    return await this.createNotification(userId, {
      type: 'enrollment',
      title: 'Хичээлд бүртгүүллээ',
      message: `Та "${course.title}" хичээлд амжилттай бүртгүүллээ.`,
      link: `/courses/${course._id || course.id}`,
      metadata: { courseId: course._id || course.id },
    });
  }

  /**
   * Create course completion notification
   */
  async notifyCourseCompletion(userId, course, progress) {
    return await this.createNotification(userId, {
      type: 'course_completion',
      title: 'Хичээл дууслаа',
      message: `Та "${course.title}" хичээлийг амжилттай дуусгалаа. Гэрчилгээ үүсгэх боломжтой.`,
      link: `/courses/${course._id || course.id}`,
      metadata: {
        courseId: course._id || course.id,
        progressPercentage: progress.progressPercentage,
      },
    });
  }

  /**
   * Create certificate notification
   */
  async notifyCertificate(userId, certificate, course) {
    return await this.createNotification(userId, {
      type: 'certificate',
      title: 'Гэрчилгээ үүслээ',
      message: `Та "${course.title}" хичээлийн гэрчилгээ авлаа.`,
      link: `/certificates/${certificate._id || certificate.id}`,
      metadata: {
        certificateId: certificate._id || certificate.id,
        certificateNumber: certificate.certificateNumber,
      },
    });
  }

  /**
   * Create payment notification
   */
  async notifyPayment(userId, payment, course) {
    return await this.createNotification(userId, {
      type: 'payment',
      title: 'Төлбөр амжилттай',
      message: `Та "${course.title}" хичээлийн төлбөрийг амжилттай төлсөн байна.`,
      link: `/courses/${course._id || course.id}`,
      metadata: {
        paymentId: payment._id || payment.id,
        amount: payment.amount,
      },
    });
  }

  /**
   * Create lesson reminder notification
   */
  async notifyLessonReminder(userId, course, nextLesson) {
    return await this.createNotification(userId, {
      type: 'lesson_reminder',
      title: 'Хичээл үргэлжлүүлэх',
      message: `"${course.title}" хичээлийг үргэлжлүүлэх цаг боллоо.`,
      link: `/courses/${course._id || course.id}`,
      metadata: {
        courseId: course._id || course.id,
        nextLessonId: nextLesson?._id || nextLesson?.id,
      },
    });
  }

  /**
   * Create system notification
   */
  async notifySystem(userId, title, message, link = null) {
    return await this.createNotification(userId, {
      type: 'system',
      title,
      message,
      link,
    });
  }

  /**
   * Create announcement (for all users)
   */
  async createAnnouncement(userIds, title, message, link = null) {
    const notifications = userIds.map(userId =>
      this.createNotification(userId, {
        type: 'announcement',
        title,
        message,
        link,
      })
    );

    return await Promise.all(notifications);
  }
}

module.exports = new NotificationService();

