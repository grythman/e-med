# Серверийн Статус

## ✅ Сервер Ажиллаж Байна

**Backend Server**: `http://localhost:5000`

### Health Check
```bash
curl http://localhost:5000/health
```

**Хариу:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-03T14:33:11.206Z"
}
```

### API Endpoints

**API Info:**
```bash
curl http://localhost:5000/api
```

**Бүх endpoint-ууд:**
- Authentication: `/api/auth/*`
- Courses: `/api/courses/*`
- Lessons: `/api/lessons/*`
- Payments: `/api/payments/*`
- Certificates: `/api/certificates/*`

## Ажиллуулах

### Backend:
```bash
cd backend
npm run dev
```

### Frontend:
```bash
cd frontend
npm run dev
```

## Environment Variables

`.env` файл backend/ хавтаст байна:
- MONGODB_URI=mongodb://localhost:27017/emed
- REDIS_URL=redis://localhost:6379
- JWT_SECRET, JWT_REFRESH_SECRET
- PORT=5000

## Анхаарах Зүйлс

1. **MongoDB**: Docker container ажиллахгүй байж магадгүй (port mapping issue). MongoDB шууд суулгах эсвэл альтернатив ашиглах.
2. **Redis**: Optional - сервер Redis-гүйгээр ажиллах боломжтой.
3. **Stripe**: Optional - зөвхөн payment функц ашиглах үед шаардлагатай.

## Дараагийн Алхам

1. MongoDB connection шалгах
2. Frontend ажиллуулах
3. Integration test хийх

