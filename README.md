# Эмчийн Сургалтын Сайт (e-med)

Монголд эмчийн сургалтын сайт - Full Stack хөгжүүлэлт

## Технологийн Стак

- **Frontend**: React.js / Next.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
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
- MongoDB 7+
- Redis 7+
- npm эсвэл yarn
- Docker (optional, database-д ашиглах)

### Хурдан Эхлэл

**Cursor IDE + GitHub Codespaces** (Зөвлөмж): [CURSOR_CODESPACES.md](./CURSOR_CODESPACES.md) файлд Cursor дээр Codespace холбох зааварчилгааг үзнэ үү.

**GitHub Codespaces ашиглаж байгаа бол**: [SETUP_CODESPACES.md](./SETUP_CODESPACES.md) файлд Codespaces-д тохирсон зааварчилгааг үзнэ үү.

**WSL (Windows Subsystem for Linux) ашиглаж байгаа бол**: [SETUP_WSL.md](./SETUP_WSL.md) файлд WSL-д тохирсон зааварчилгааг үзнэ үү.

**Linux/Mac хэрэглэгчдэд**: [SETUP.md](./SETUP.md) файлд зааварчилгааг үзнэ үү.

```bash
# 1. Database эхлүүлэх (Docker)
docker-compose up -d

# MongoDB нь автоматаар холбогдоно (connection string: mongodb://localhost:27017/emed)

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

