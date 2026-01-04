# MongoDB Migration Guide

## Хэрэгжүүлсэн Өөрчлөлтүүд

### 1. Dependencies
- ✅ `mongoose` package нэмсэн
- ✅ `pg` package устгасан (PostgreSQL)

### 2. Database Connection
- ✅ `backend/config/database.js` - MongoDB connection (Mongoose)
- ✅ Connection string: `mongodb://localhost:27017/emed`

### 3. Models (Mongoose Schemas)
Бүх models үүсгэсэн:
- ✅ `User.js`
- ✅ `Course.js`
- ✅ `Lesson.js`
- ✅ `Enrollment.js`
- ✅ `LessonProgress.js`
- ✅ `Quiz.js`
- ✅ `Question.js`
- ✅ `Answer.js`
- ✅ `QuizAttempt.js`
- ✅ `Certificate.js`
- ✅ `Payment.js`
- ✅ `PasswordResetToken.js`

### 4. Repositories
Бүх repository-ууд MongoDB queries руу хөрвүүлсэн:
- ✅ `userRepository.js`
- ✅ `courseRepository.js`
- ✅ `enrollmentRepository.js`
- ✅ `lessonRepository.js`
- ✅ `paymentRepository.js`
- ✅ `certificateRepository.js`

### 5. Routes & Services
- ✅ Auth routes MongoDB-д шилжсэн
- ✅ Auth middleware MongoDB-д шилжсэн
- ✅ Services-д ObjectId зөв ашиглах

### 6. Docker Compose
- ✅ PostgreSQL-г MongoDB-р сольсон
- ✅ MongoDB 7 image ашиглаж байна

## Environment Variables

`.env` файлд дараах хувьсагч нэмэх:

```env
MONGODB_URI=mongodb://localhost:27017/emed
# эсвэл
DATABASE_URL=mongodb://localhost:27017/emed
```

## Ажиллуулах

```bash
# 1. MongoDB эхлүүлэх (Docker)
docker-compose up -d

# 2. Backend dependencies суулгах
cd backend
npm install

# 3. Backend ажиллуулах
npm run dev
```

## Анхаарах Зүйлс

1. **ObjectId**: MongoDB-д `_id` ашиглана, PostgreSQL-ийн `id` биш
2. **Populate**: Mongoose populate ашиглан related documents авах
3. **Indexes**: Models-д indexes тодорхойлсон
4. **Validation**: Mongoose schema validation ашиглана

## Database Migrations

MongoDB нь schema-less байдаг тул migrations шаардлагагүй. Гэхдээ seed scripts үүсгэх боломжтой.

## Дараагийн Алхам

- [ ] Seed scripts үүсгэх (test data)
- [ ] MongoDB indexes optimization
- [ ] Connection pooling settings
- [ ] Backup strategy


