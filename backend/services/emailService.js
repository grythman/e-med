const nodemailer = require('nodemailer');
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
    const html = `
      <h1>Тавтай морилно уу, ${user.firstName}!</h1>
      <p>Та e-med платформд амжилттай бүртгүүллээ.</p>
      <p>Одоо та бүх хичээлүүдэд хандах боломжтой.</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses">Хичээлүүд үзэх</a></p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const subject = 'e-med - Нууц үг сэргээх';
    const html = `
      <h1>Нууц үг сэргээх</h1>
      <p>Та нууц үгээ сэргээх хүсэлт илгээсэн байна.</p>
      <p>Дараах холбоос дээр дарж нууц үгээ сэргээнэ үү:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Энэ холбоос 1 цагийн дараа хүчингүй болно.</p>
      <p>Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тоомсорлож болно.</p>
    `;

    return await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send course enrollment email
   */
  async sendEnrollmentEmail(user, course) {
    const subject = `e-med - "${course.title}" хичээлд бүртгүүллээ`;
    const html = `
      <h1>Баяр хүргэе!</h1>
      <p>Та "${course.title}" хичээлд амжилттай бүртгүүллээ.</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}">Хичээл үзэх</a></p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  /**
   * Send certificate email
   */
  async sendCertificateEmail(user, certificate, course) {
    const subject = `e-med - "${course.title}" хичээлийн гэрчилгээ`;
    const html = `
      <h1>Баяр хүргэе!</h1>
      <p>Та "${course.title}" хичээлийг амжилттай дуусгаж, гэрчилгээ авлаа.</p>
      <p>Гэрчилгээний дугаар: ${certificate.certificateNumber}</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificates/${certificate._id || certificate.id}">Гэрчилгээ үзэх</a></p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

module.exports = new EmailService();

