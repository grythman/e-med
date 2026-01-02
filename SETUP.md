# Суулгах Зааварчилгаа

## Шаардлагууд

- Node.js 18+ 
- PostgreSQL 15+
- Redis 7+
- npm эсвэл yarn
- Docker (optional, database-д ашиглах)

## 1. Database Setup

### Docker ашиглах (Зөвлөмж):

```bash
# PostgreSQL ба Redis эхлүүлэх
docker-compose up -d

# Database connection шалгах
docker ps
```

### Manual Setup:

1. PostgreSQL суулгах
2. Database үүсгэх:
```sql
CREATE DATABASE emed;
```

3. Redis суулгах

## 2. Backend Setup

```bash
cd backend

# Dependencies суулгах
npm install

# Environment variables тохируулах
# .env.example файлыг .env болгон хуулах, дараа нь утгуудыг тохируулах
cp .env.example .env

# .env файлыг засах:
# - DATABASE_URL
# - JWT_SECRET (random string үүсгэх)
# - JWT_REFRESH_SECRET (random string үүсгэх)
# - Бусад тохиргоонууд

# Database migrations ажиллуулах
# PostgreSQL-д холбогдож:
psql -h localhost -U postgres -d emed -f ../database/migrations/001_initial_schema.sql

# Server эхлүүлэх
npm run dev
```

Backend server `http://localhost:5000` дээр ажиллана.

## 3. Frontend Setup

```bash
cd frontend

# Dependencies суулгах
npm install

# Environment variables тохируулах
# .env.example файлыг .env болгон хуулах
cp .env.example .env

# .env файлыг засах:
# - VITE_API_URL=http://localhost:5000/api

# Development server эхлүүлэх
npm run dev
```

Frontend `http://localhost:3000` дээр ажиллана.

## 4. Environment Variables

### Backend (.env):

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/emed
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend (.env):

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=e-med
```

## 5. Testing

### Backend API Test:

```bash
# Health check
curl http://localhost:5000/health

# API info
curl http://localhost:5000/api
```

### User Registration Test:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### User Login Test:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

## 6. Troubleshooting

### Database connection алдаа:

1. PostgreSQL ажиллаж байгаа эсэхийг шалгах:
```bash
docker ps
# эсвэл
psql -U postgres -c "SELECT version();"
```

2. DATABASE_URL зөв эсэхийг шалгах
3. Database үүсгэсэн эсэхийг шалгах

### Port already in use:

```bash
# Port 5000 ашиглаж байгаа эсэхийг шалгах
lsof -i :5000
# эсвэл Windows дээр:
netstat -ano | findstr :5000
```

### Module not found:

```bash
# Dependencies дахин суулгах
rm -rf node_modules package-lock.json
npm install
```

## 7. Next Steps

1. ✅ Database setup
2. ✅ Backend basic setup
3. ✅ Frontend basic setup
4. ⏭️ Course management API
5. ⏭️ Video upload/streaming
6. ⏭️ Payment integration
7. ⏭️ Frontend pages development

## Холбоос

- [Backend API Documentation](./backend/README.md)
- [Database Schema](./database/README.md)
- [Research Documents](./research/README.md)






