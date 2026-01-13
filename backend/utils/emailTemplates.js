/**
 * Email Templates
 * Professional HTML email templates for e-med
 */

const getBaseTemplate = (content, title) => `
<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 10px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #2563eb;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .highlight {
      background-color: #eff6ff;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
      border-left: 4px solid #3b82f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">e-med</div>
      <p style="color: #6b7280; margin: 0;">Эмчийн Сургалтын Платформ</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} e-med. Бүх эрх хуулиар хамгаалагдсан.</p>
      <p>Хэрэв та энэ имэйлийг хүлээн авах ёсгүй байсан бол бидэнтэй холбогдоно уу.</p>
    </div>
  </div>
</body>
</html>
`;

const templates = {
  welcome: (user) => getBaseTemplate(
    `
      <h1 style="color: #1e40af;">Тавтай морилно уу, ${user.firstName}!</h1>
      <p>Та e-med платформд амжилттай бүртгүүллээ. Бид танд мэргэжлийн сургалтуудыг санал болгохдоо баяртай байна.</p>
      <div class="highlight">
        <strong>Эхлэх:</strong>
        <ul>
          <li>Хичээлүүдээ сонгох</li>
          <li>Мэргэжлийн багш нараас сурах</li>
          <li>Гэрчилгээ авах</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses" class="button">Хичээлүүд үзэх</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Асуулт байвал бидэнтэй холбогдоно уу: support@emed.mn</p>
    `,
    'Тавтай морилно уу!'
  ),

  passwordReset: (resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    return getBaseTemplate(
      `
        <h1 style="color: #1e40af;">Нууц үг сэргээх</h1>
        <p>Та нууц үгээ сэргээх хүсэлт илгээсэн байна.</p>
        <div class="highlight">
          <p><strong>Анхаар:</strong> Энэ холбоос 1 цагийн дараа хүчингүй болно.</p>
        </div>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Нууц үг сэргээх</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тоомсорлож болно.</p>
        <p style="color: #6b7280; font-size: 12px; word-break: break-all;">Холбоос ажиллахгүй бол: ${resetUrl}</p>
      `,
      'Нууц үг сэргээх'
    );
  },

  enrollment: (user, course) => getBaseTemplate(
    `
      <h1 style="color: #10b981;">Баяр хүргэе!</h1>
      <p>Тавтай морилно уу, ${user.firstName}!</p>
      <p>Та "<strong>${course.title}</strong>" хичээлд амжилттай бүртгүүллээ.</p>
      ${course.description ? `<p style="color: #6b7280;">${course.description.substring(0, 150)}...</p>` : ''}
      <div class="highlight">
        <p><strong>Дараагийн алхам:</strong></p>
        <ul>
          <li>Хичээлүүдийг үзэж эхлэх</li>
          <li>Хичээл бүрийн дараа шалгалт өгөх</li>
          <li>Хичээлийг дуусгаж гэрчилгээ авах</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}" class="button">Хичээл үзэх</a>
      </div>
    `,
    `"${course.title}" хичээлд бүртгүүллээ`
  ),

  certificate: (user, certificate, course) => getBaseTemplate(
    `
      <h1 style="color: #10b981;">🎉 Баяр хүргэе!</h1>
      <p>Тавтай морилно уу, ${user.firstName}!</p>
      <p>Та "<strong>${course.title}</strong>" хичээлийг амжилттай дуусгаж, гэрчилгээ авлаа.</p>
      <div class="highlight">
        <p><strong>Гэрчилгээний дугаар:</strong> ${certificate.certificateNumber}</p>
        <p><strong>Олгосон огноо:</strong> ${new Date(certificate.issuedAt).toLocaleDateString('mn-MN')}</p>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificates/${certificate._id || certificate.id}" class="button">Гэрчилгээ үзэх</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Гэрчилгээгээ баталгаажуулах: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/certificates/verify/${certificate.verificationCode}</p>
    `,
    `"${course.title}" хичээлийн гэрчилгээ`
  ),

  courseCompletion: (user, course, progress) => getBaseTemplate(
    `
      <h1 style="color: #10b981;">Хичээл дууслаа!</h1>
      <p>Тавтай морилно уу, ${user.firstName}!</p>
      <p>Та "<strong>${course.title}</strong>" хичээлийг амжилттай дуусгалаа.</p>
      <div class="highlight">
        <p><strong>Явц:</strong> ${progress.progressPercentage}%</p>
        <p><strong>Дуусгасан хичээл:</strong> ${progress.completedLessons?.length || 0}</p>
      </div>
      <p>Одоо та гэрчилгээ авах боломжтой.</p>
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}" class="button">Гэрчилгээ үүсгэх</a>
      </div>
    `,
    `"${course.title}" хичээл дууслаа`
  ),

  paymentConfirmation: (user, payment, course) => getBaseTemplate(
    `
      <h1 style="color: #10b981;">Төлбөр амжилттай!</h1>
      <p>Тавтай морилно уу, ${user.firstName}!</p>
      <p>Та "<strong>${course.title}</strong>" хичээлийн төлбөрийг амжилттай төлсөн байна.</p>
      <div class="highlight">
        <p><strong>Төлбөрийн дугаар:</strong> ${payment._id || payment.id}</p>
        <p><strong>Дүн:</strong> ${payment.amount?.toLocaleString()} ₮</p>
        <p><strong>Төлбөрийн арга:</strong> ${payment.paymentMethod}</p>
        <p><strong>Огноо:</strong> ${new Date(payment.createdAt || Date.now()).toLocaleDateString('mn-MN')}</p>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}" class="button">Хичээл үзэх</a>
      </div>
    `,
    'Төлбөр амжилттай'
  ),

  lessonReminder: (user, course, nextLesson) => getBaseTemplate(
    `
      <h1 style="color: #3b82f6;">Хичээл үргэлжлүүлэх цаг боллоо</h1>
      <p>Тавтай морилно уу, ${user.firstName}!</p>
      <p>Та "<strong>${course.title}</strong>" хичээлийг үргэлжлүүлэх цаг боллоо.</p>
      ${nextLesson ? `
        <div class="highlight">
          <p><strong>Дараагийн хичээл:</strong> ${nextLesson.title}</p>
        </div>
      ` : ''}
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${course._id || course.id}" class="button">Хичээл үргэлжлүүлэх</a>
      </div>
    `,
    'Хичээл үргэлжлүүлэх'
  ),
};

module.exports = templates;

