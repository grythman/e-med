# Архитектурын Дизайн

## 1. Системийн Архитектур

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph ClientLayer["Client Layer"]
        WebApp["Web App<br/>(React/Next.js)"]
        MobileApp["Mobile App<br/>(React Native)"]
    end
    
    subgraph GatewayLayer["API Gateway Layer"]
        APIGateway["API Gateway<br/>(Nginx/Cloudflare)"]
        LoadBalancer["Load Balancer"]
    end
    
    subgraph ApplicationLayer["Application Layer"]
        AuthService["Auth Service<br/>(Node.js)"]
        CourseService["Course Service<br/>(Node.js)"]
        VideoService["Video Service<br/>(Node.js)"]
        PaymentService["Payment Service<br/>(Node.js)"]
        NotificationService["Notification Service<br/>(Node.js)"]
    end
    
    subgraph DataLayer["Data Layer"]
        PostgreSQL["PostgreSQL<br/>(Primary DB)"]
        Redis["Redis<br/>(Cache/Sessions)"]
        S3["S3/Cloudflare R2<br/>(File Storage)"]
    end
    
    subgraph ExternalServices["External Services"]
        VideoCDN["Video CDN<br/>(Cloudflare Stream)"]
        PaymentGateway["Payment Gateway<br/>(Stripe/QPay)"]
        EmailService["Email Service<br/>(SendGrid/SES)"]
    end
    
    WebApp --> APIGateway
    MobileApp --> APIGateway
    APIGateway --> LoadBalancer
    LoadBalancer --> AuthService
    LoadBalancer --> CourseService
    LoadBalancer --> VideoService
    LoadBalancer --> PaymentService
    LoadBalancer --> NotificationService
    
    AuthService --> PostgreSQL
    AuthService --> Redis
    CourseService --> PostgreSQL
    CourseService --> Redis
    VideoService --> PostgreSQL
    VideoService --> S3
    VideoService --> VideoCDN
    PaymentService --> PostgreSQL
    PaymentService --> PaymentGateway
    NotificationService --> Redis
    NotificationService --> EmailService
```

### 1.2 Microservices Architecture

#### Service Breakdown:

1. **Auth Service**
   - User registration/login
   - JWT token management
   - OAuth integration
   - Role-based access control (RBAC)

2. **Course Service**
   - Course management (CRUD)
   - Course enrollment
   - Course progress tracking
   - Certificate generation

3. **Video Service**
   - Video upload/processing
   - Video streaming
   - Video analytics
   - Thumbnail generation

4. **Payment Service**
   - Payment processing
   - Subscription management
   - Invoice generation
   - Refund handling

5. **Notification Service**
   - Email notifications
   - Push notifications
   - In-app notifications
   - SMS notifications (optional)

6. **Forum Service** (Phase 2)
   - Discussion threads
   - Comments
   - Moderation

7. **Chat Service** (Phase 2)
   - Real-time messaging
   - Group chats
   - File sharing

## 2. Database Schema Design

### 2.1 Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'student', -- student, teacher, admin
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Courses Table
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    thumbnail_url TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    duration_hours INTEGER,
    level VARCHAR(50), -- beginner, intermediate, advanced
    language VARCHAR(10) DEFAULT 'mn', -- mn, en
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published);
```

#### Lessons Table
```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    video_duration INTEGER, -- seconds
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
```

#### Enrollments Table
```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

#### Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    watched_duration INTEGER DEFAULT 0, -- seconds
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
```

#### Quizzes Table
```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70, -- percentage
    time_limit INTEGER, -- minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);
```

#### Questions Table
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- multiple_choice, true_false, short_answer
    order_index INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);
```

#### Answers Table
```sql
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question ON answers(question_id);
```

#### Quiz Attempts Table
```sql
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER,
    is_passed BOOLEAN,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_enrollment ON quiz_attempts(enrollment_id);
```

#### Certificates Table
```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url TEXT,
    verification_code VARCHAR(50) UNIQUE NOT NULL
);

CREATE INDEX idx_certificates_enrollment ON certificates(enrollment_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
```

#### Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MNT',
    payment_method VARCHAR(50), -- stripe, qpay, bank_transfer
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
```

### 2.2 Phase 2 Tables (Forum & Chat)

#### Forum Topics Table
```sql
CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_topics_course ON forum_topics(course_id);
```

#### Forum Comments Table
```sql
CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES forum_comments(id), -- for nested comments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forum_comments_topic ON forum_comments(topic_id);
```

#### Chat Rooms Table
```sql
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255),
    is_group BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_rooms_course ON chat_rooms(course_id);
```

#### Chat Messages Table
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);
```

## 3. API Structure

### 3.1 RESTful API Design

#### Base URL Structure
```
https://api.emed.mn/v1
```

#### Authentication Endpoints
```
POST   /auth/register          - User registration
POST   /auth/login             - User login
POST   /auth/logout            - User logout
POST   /auth/refresh           - Refresh JWT token
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password
GET    /auth/me                - Get current user
PUT    /auth/me                - Update current user
```

#### Course Endpoints
```
GET    /courses                - List courses (with filters)
GET    /courses/:id            - Get course details
POST   /courses                - Create course (admin/teacher)
PUT    /courses/:id            - Update course (admin/teacher)
DELETE /courses/:id            - Delete course (admin)
GET    /courses/:id/lessons    - Get course lessons
POST   /courses/:id/enroll    - Enroll in course
GET    /courses/:id/progress   - Get course progress
```

#### Lesson Endpoints
```
GET    /lessons/:id            - Get lesson details
GET    /lessons/:id/video      - Get video URL
PUT    /lessons/:id/progress   - Update lesson progress
GET    /lessons/:id/quiz       - Get lesson quiz
POST   /lessons/:id/quiz/attempt - Submit quiz attempt
```

#### Payment Endpoints
```
POST   /payments               - Create payment
GET    /payments/:id           - Get payment status
POST   /payments/:id/webhook   - Payment webhook
GET    /payments/history       - Get payment history
```

#### Certificate Endpoints
```
GET    /certificates           - List user certificates
GET    /certificates/:id       - Get certificate
GET    /certificates/verify/:code - Verify certificate
POST   /certificates/:id/download - Download certificate PDF
```

### 3.2 Real-time API (WebSocket)

#### Socket.io Events

**Client → Server:**
```javascript
// Join course room
socket.emit('join:course', { courseId: 'uuid' });

// Send chat message
socket.emit('chat:message', { 
  roomId: 'uuid', 
  message: 'text' 
});

// Typing indicator
socket.emit('chat:typing', { 
  roomId: 'uuid', 
  isTyping: true 
});
```

**Server → Client:**
```javascript
// New message
socket.on('chat:message', (data) => { ... });

// User joined/left
socket.on('chat:user:joined', (data) => { ... });
socket.on('chat:user:left', (data) => { ... });

// Typing indicator
socket.on('chat:typing', (data) => { ... });

// Notification
socket.on('notification', (data) => { ... });
```

## 4. Frontend Architecture

### 4.1 Component Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   ├── course/          # Course-related components
│   │   ├── CourseCard/
│   │   ├── CourseList/
│   │   └── CoursePlayer/
│   └── auth/            # Auth components
│       ├── LoginForm/
│       └── RegisterForm/
├── pages/
│   ├── Home/
│   ├── Courses/
│   ├── CourseDetail/
│   ├── Lesson/
│   ├── Profile/
│   └── Admin/
├── services/
│   ├── api/             # API client
│   ├── auth/            # Auth service
│   └── storage/         # Local storage
├── store/               # State management (Redux/Zustand)
│   ├── slices/
│   └── store.ts
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── i18n/                # Internationalization
    ├── mn.json
    └── en.json
```

### 4.2 State Management

#### Redux Toolkit Structure:
```javascript
store/
├── slices/
│   ├── authSlice.ts
│   ├── courseSlice.ts
│   ├── lessonSlice.ts
│   └── uiSlice.ts
└── store.ts
```

## 5. Security Architecture

### 5.1 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant AuthService
    participant Database
    participant Redis
    
    Client->>API: POST /auth/login (email, password)
    API->>AuthService: Validate credentials
    AuthService->>Database: Check user credentials
    Database-->>AuthService: User data
    AuthService->>AuthService: Verify password (bcrypt)
    AuthService->>AuthService: Generate JWT tokens
    AuthService->>Redis: Store refresh token
    AuthService-->>API: Access token + Refresh token
    API-->>Client: Return tokens
    Client->>Client: Store tokens (httpOnly cookie/localStorage)
```

### 5.2 Authorization (RBAC)

#### Roles:
- **Student**: Enroll, watch courses, take quizzes
- **Teacher**: Create courses, manage content
- **Admin**: Full system access

#### Permission Matrix:
| Resource | Student | Teacher | Admin |
|----------|---------|---------|-------|
| View Courses | ✅ | ✅ | ✅ |
| Enroll | ✅ | ✅ | ✅ |
| Create Course | ❌ | ✅ | ✅ |
| Edit Course | ❌ | Own | ✅ |
| Delete Course | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

## 6. Deployment Architecture

### 6.1 Container Architecture

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 6.2 Docker Compose (Development)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: emed
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/emed
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
  
  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    depends_on:
      - api

volumes:
  postgres_data:
```

## 7. Monitoring & Logging

### 7.1 Logging Strategy

- **Application Logs**: Winston (Node.js) эсвэл Pino
- **Access Logs**: Nginx access logs
- **Error Tracking**: Sentry эсвэл Rollbar
- **Log Aggregation**: ELK Stack эсвэл CloudWatch

### 7.2 Monitoring

- **Application Performance**: New Relic эсвэл Datadog
- **Uptime Monitoring**: UptimeRobot эсвэл Pingdom
- **Database Monitoring**: PostgreSQL monitoring tools
- **Server Monitoring**: Prometheus + Grafana

## 8. Дүгнэлт

Энэ архитектур нь:
- **Scalable**: Microservices архитектур
- **Maintainable**: Тодорхой service separation
- **Secure**: Authentication, authorization, encryption
- **Performant**: Caching, CDN, database optimization
- **Flexible**: Phase 2 функцүүдийг хялбар нэмэх








