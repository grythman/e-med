# Database Setup

## PostgreSQL Setup

### Using Docker

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
psql -h localhost -U postgres -d emed -f migrations/001_initial_schema.sql
```

### Manual Setup

1. Install PostgreSQL 15+
2. Create database:
```sql
CREATE DATABASE emed;
```

3. Run migrations:
```bash
psql -U postgres -d emed -f migrations/001_initial_schema.sql
```

## Database Schema

See `migrations/001_initial_schema.sql` for the complete schema.

### Core Tables:
- `users` - User accounts
- `courses` - Course information
- `lessons` - Course lessons
- `enrollments` - User course enrollments
- `lesson_progress` - Lesson completion tracking
- `quizzes` - Course quizzes
- `questions` - Quiz questions
- `answers` - Question answers
- `quiz_attempts` - Quiz attempt records
- `certificates` - Course completion certificates
- `payments` - Payment transactions







