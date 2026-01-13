const nodemailer = require('nodemailer');
const emailTemplates = require('../utils/emailTemplates');
require('dotenv').config();

/**
 * Email Service
 * Handles email sending (SendGrid, SMTP, etc.)
 */
class EmailService {
  constructor() {
    // Initialize transporter based on environment
    if (process.env.SENDGRID_API_KEY) {
      // SendGrid configuration
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else if (process.env.SMTP_HOST) {
      // SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Use console logging
      this.transporter = null;
    }
  }

  /**
   * Send email
   */
  async sendEmail({ to, subject, html, text }) {
    if (!this.transporter) {
      // Development mode: log email
      console.log('📧 Email (Development):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Body:', text || html);
      return { success: true, message: 'Email logged (development mode)' };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@emed.mn',
        to,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    const subject = 'e-med - Тавтай морилно уу!';
    const html = emailTemplates.welcome(user);
    const text = `Тавтай морилно уу, ${user.firstName}!\n\nТа e-med платформд амжилттай бүртгүүллээ.\n\nХичээлүүд үзэх: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses`;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, resetToken) {
    const subject = 'e-med - Нууц үг сэргээх';
    const html = emailTemplates.passwordReset(resetToken);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const text = `Нууц үг сэргээх\n\nТа нууц үгээ сэргээх хүсэлт илгээсэн байна.\n\nХолбоос: ${resetUrl}\n\nЭнэ холбоос 1 цагийн дараа хүчингүй болно.`;

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send course enrollment email
   */
  async sendEnrollmentEmail(user, course) {
    const subject = `e-med - "${course.title}" хичээлд бүртгүүллээ`;
    const html = emailTemplates.enrollment(user, course);
    const text = `Баяр хүргэе!\n\nТа "${course.title}" хичээлд амжилттай бүртгүүллээ.\n\nХичээл үзэх: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}`;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send certificate email
   */
  async sendCertificateEmail(user, certificate, course) {
    const subject = `e-med - "${course.title}" хичээлийн гэрчилгээ`;
    const html = emailTemplates.certificate(user, certificate, course);
    const text = `Баяр хүргэе!\n\nТа "${course.title}" хичээлийг амжилттай дуусгаж, гэрчилгээ авлаа.\n\nГэрчилгээний дугаар: ${certificate.certificateNumber}\n\nГэрчилгээ үзэх: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificates/${certificate._id || certificate.id}`;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send course completion email
   */
  async sendCourseCompletionEmail(user, course, progress) {
    const subject = `e-med - "${course.title}" хичээл дууслаа`;
    const html = emailTemplates.courseCompletion(user, course, progress);
    const text = `Хичээл дууслаа!\n\nТа "${course.title}" хичээлийг амжилттай дуусгалаа.\n\nЯвц: ${progress.progressPercentage}%\n\nГэрчилгээ үүсгэх: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}`;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(user, payment, course) {
    const subject = 'e-med - Төлбөр амжилттай';
    const html = emailTemplates.paymentConfirmation(user, payment, course);
    const text = `Төлбөр амжилттай!\n\nТа "${course.title}" хичээлийн төлбөрийг амжилттай төлсөн байна.\n\nДүн: ${payment.amount?.toLocaleString()} ₮\nТөлбөрийн дугаар: ${payment._id || payment.id}`;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Send lesson reminder email
   */
  async sendLessonReminderEmail(user, course, nextLesson) {
    const subject = `e-med - "${course.title}" хичээл үргэлжлүүлэх`;
    const html = emailTemplates.lessonReminder(user, course, nextLesson);
    const text = `Хичээл үргэлжлүүлэх цаг боллоо\n\nТа "${course.title}" хичээлийг үргэлжлүүлэх цаг боллоо.\n\nХичээл үзэх: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}`;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }
}

module.exports = new EmailService();

