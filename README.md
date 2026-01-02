# Эмчийн Сургалтын Сайт (e-med)

Монголд эмчийн сургалтын сайт - Full Stack хөгжүүлэлт

## Технологийн Стак

- **Frontend**: React.js / Next.js
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Mobile**: React Native (Phase 3)

## Төслийн Бүтэц

```
e-med/
├── backend/          # Backend API (Node.js + Express)
├── frontend/        # Frontend (React)
├── mobile/          # Mobile App (React Native) - Phase 3
├── database/        # Database migrations & seeds
├── docker/          # Docker configurations
└── research/        # Судалгааны баримт бичгүүд
```

## Хөгжүүлэлт

### Шаардлагууд

- Node.js 18+
- MongoDB 7+ (эсвэл Docker ашиглах)
- Redis 7+ (эсвэл Docker ашиглах)
- npm эсвэл yarn
- Docker Desktop (optional, database-д ашиглах)

### Хурдан Эхлэл

**Windows хэрэглэгчдэд**: [SETUP_WINDOWS.md](./SETUP_WINDOWS.md) файлд Windows-д тохирсон зааварчилгааг үзнэ үү.

**Linux/Mac хэрэглэгчдэд**: [SETUP.md](./SETUP.md) файлд зааварчилгааг үзнэ үү.

```bash
# 1. Database эхлүүлэх (Docker)
docker-compose up -d

# MongoDB нь migrations хэрэггүй - Mongoose models автоматаар collections үүсгэнэ

# 3. Backend
cd backend
npm install
# .env файл үүсгэж тохируулах
npm run dev

# 4. Frontend (шинэ terminal)
cd frontend
npm install
# .env файл үүсгэж тохируулах
npm run dev
```

### Ажиллуулах

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## Документаци

Дэлгэрэнгүй судалгааны баримт бичгүүдийг `research/` хавтаст үзнэ үү.

## Лиценз

MIT

