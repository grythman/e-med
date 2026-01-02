# Backend API

Эмчийн сургалтын сайтын backend API (Node.js + Express + PostgreSQL)

## Бүтэц

```
backend/
├── config/          # Configuration files
│   └── database.js  # PostgreSQL connection
├── middleware/      # Express middleware
│   ├── auth.js     # Authentication middleware
│   └── validation.js # Input validation
├── repositories/   # Data access layer
│   ├── courseRepository.js
│   ├── enrollmentRepository.js
│   ├── lessonRepository.js
│   ├── paymentRepository.js
│   ├── certificateRepository.js
│   └── userRepository.js
├── services/        # Business logic layer
│   ├── courseService.js
│   ├── lessonService.js
│   ├── paymentService.js
│   └── certificateService.js
├── routes/         # API routes
│   ├── auth.js    # Authentication routes
│   ├── courses.js # Course routes
│   ├── lessons.js # Lesson routes
│   ├── payments.js # Payment routes
│   └── certificates.js # Certificate routes
├── utils/          # Utility functions
│   ├── jwt.js     # JWT token management
│   └── password.js # Password hashing
└── server.js       # Main server file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/me` - Update user profile (requires auth)

### Courses

- `GET /api/courses` - List courses (with filters)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin/teacher only)
- `PUT /api/courses/:id` - Update course (admin/teacher only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `GET /api/courses/:id/lessons` - Get course lessons
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/progress` - Get course progress

### Lessons

- `GET /api/lessons/:id` - Get lesson details
- `GET /api/lessons/:id/video` - Get video URL (with access control)
- `PUT /api/lessons/:id/progress` - Update lesson progress
- `GET /api/lessons/:id/quiz` - Get lesson quiz
- `POST /api/lessons/:id/quiz/attempt` - Submit quiz attempt

### Payments

- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment status
- `POST /api/payments/:id/webhook` - Payment webhook
- `GET /api/payments/history` - Get payment history

### Certificates

- `GET /api/certificates` - List user certificates
- `GET /api/certificates/:id` - Get certificate
- `GET /api/certificates/verify/:code` - Verify certificate (public)
- `POST /api/certificates/:id/download` - Download certificate PDF
- `POST /api/certificates/generate/:enrollmentId` - Generate certificate

### Health Check

- `GET /health` - Server health check
- `GET /api` - API information

## Security Features

- ✅ Helmet.js - Security headers
- ✅ Rate limiting - API protection
- ✅ CORS - Cross-origin resource sharing
- ✅ Input validation - express-validator
- ✅ Password hashing - bcrypt
- ✅ JWT authentication
- ✅ SQL injection prevention

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

## Environment Variables

See `.env.example` for required environment variables.

## Database

PostgreSQL database connection configured in `config/database.js`.

Required tables are created via migrations in `../database/migrations/`.








