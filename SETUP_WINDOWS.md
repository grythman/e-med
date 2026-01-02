# Суулгах Зааварчилгаа (Windows)

## Шаардлагууд

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB 7+ ([Download](https://www.mongodb.com/try/download/community) эсвэл Docker ашиглах)
- Redis 7+ ([Download](https://github.com/microsoftarchive/redis/releases) эсвэл Docker ашиглах)
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop)) - Зөвлөмж
- Git Bash эсвэл PowerShell

## 1. Database Setup

### Сонголт 1: Docker Desktop ашиглах (Зөвлөмж)

```powershell
# PowerShell эсвэл Command Prompt дээр

# Docker Desktop эхлүүлэх (Desktop app-аас)

# MongoDB ба Redis эхлүүлэх
docker-compose up -d

# Database connection шалгах
docker ps
```

MongoDB `mongodb://localhost:27017/emed` дээр ажиллана.

### Сонголт 2: MongoDB Manual Setup

1. MongoDB Community Edition суулгах ([Download](https://www.mongodb.com/try/download/community))
2. MongoDB service эхлүүлэх:
   ```powershell
   # Windows Services дээр MongoDB эхлүүлэх
   net start MongoDB
   ```
3. MongoDB connection шалгах:
   ```powershell
   mongosh
   # эсвэл
   mongo
   ```
4. Redis суулгах эсвэл Docker ашиглах

## 2. Backend Setup

### PowerShell эсвэл Command Prompt:

```powershell
cd backend

# Dependencies суулгах
npm install

# Environment variables тохируулах
# .env.example файлыг .env болгон хуулах
copy .env.example .env

# .env файлыг Notepad эсвэл VS Code-оор нээж засах:
# - MONGODB_URI=mongodb://localhost:27017/emed
# - JWT_SECRET (random string үүсгэх)
# - JWT_REFRESH_SECRET (random string үүсгэх)
# - Бусад тохиргоонууд
```

### .env файл тохируулах:

Notepad эсвэл VS Code-оор `backend/.env` файлыг нээж:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB (Docker ашиглаж байгаа бол)
MONGODB_URI=mongodb://localhost:27017/emed

# MongoDB (Manual setup - хэрэв өөр port ашиглаж байгаа бол)
# MONGODB_URI=mongodb://localhost:27017/emed

REDIS_URL=redis://localhost:6379

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12
```

**Анхаар**: MongoDB нь default-оор нууц үггүй байдаг. Production-д нууц үг тохируулах хэрэгтэй.

### MongoDB Setup

**Анхаар**: MongoDB нь SQL database биш тул migrations хэрэггүй! Mongoose models нь автоматаар collections үүсгэнэ.

MongoDB connection зөв байвал server эхлэхэд автоматаар холбогдоно.

### Server эхлүүлэх:

```powershell
# Development mode (nodemon)
npm run dev

# Production mode
npm start
```

Backend server `http://localhost:5000` дээр ажиллана.

## 3. Frontend Setup

### PowerShell эсвэл Command Prompt:

```powershell
cd frontend

# Dependencies суулгах
npm install

# Environment variables тохируулах
copy .env.example .env

# .env файлыг Notepad эсвэл VS Code-оор нээж засах:
# - VITE_API_URL=http://localhost:5000/api
```

### .env файл тохируулах:

`frontend/.env` файлыг нээж:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=e-med
VITE_APP_VERSION=1.0.0
```

### Development server эхлүүлэх:

```powershell
npm run dev
```

Frontend `http://localhost:3000` дээр ажиллана.

## 4. Environment Variables Summary

### Backend (.env):

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB (Docker ашиглаж байгаа бол)
MONGODB_URI=mongodb://localhost:27017/emed

# MongoDB (Manual setup)
# MONGODB_URI=mongodb://localhost:27017/emed

# Redis
REDIS_URL=redis://localhost:6379

# JWT (Random string үүсгэх - PowerShell дээр):
# [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12
```

### Frontend (.env):

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=e-med
```

## 5. Testing

### PowerShell дээр curl ашиглах:

```powershell
# Health check
curl http://localhost:5000/health

# API info
curl http://localhost:5000/api
```

### Postman эсвэл Thunder Client ашиглах (Зөвлөмж):

1. Postman суулгах ([Download](https://www.postman.com/downloads/))
2. Эсвэл VS Code дээр Thunder Client extension суулгах

### User Registration Test:

**Postman/Thunder Client:**
- Method: POST
- URL: `http://localhost:5000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "firstName": "Test",
  "lastName": "User"
}
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"Test123!@#","firstName":"Test","lastName":"User"}'
```

### User Login Test:

**Postman/Thunder Client:**
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

## 6. Windows-д Тусгай Тохируулга

### PowerShell Execution Policy:

Хэрэв script ажиллуулахад алдаа гарвал:

```powershell
# Execution policy шалгах
Get-ExecutionPolicy

# Execution policy өөрчлөх (Admin PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use:

```powershell
# Port 5000 ашиглаж байгаа process-ийг олох
netstat -ano | findstr :5000

# Process ID-г ашиглан устгах
taskkill /PID <process_id> /F
```

### Node Modules Issues:

```powershell
# node_modules устгах
Remove-Item -Recurse -Force node_modules

# package-lock.json устгах
Remove-Item package-lock.json

# Дахин суулгах
npm install
```

### Path Issues:

```powershell
# PostgreSQL psql path нэмэх (хэрэв шаардлагатай бол)
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"
```

### Line Endings (CRLF vs LF):

Git ашиглаж байгаа бол:
```powershell
# .gitattributes файл үүсгэх
echo "* text=auto" > .gitattributes
echo "*.js text eol=lf" >> .gitattributes
echo "*.jsx text eol=lf" >> .gitattributes
```

## 7. Troubleshooting

### Database Connection Error:

1. MongoDB ажиллаж байгаа эсэхийг шалгах:
```powershell
# Docker ашиглаж байгаа бол
docker ps

# Manual setup бол
Get-Service -Name MongoDB
# эсвэл
net start MongoDB
```

2. MONGODB_URI зөв эсэхийг шалгах
3. MongoDB connection test:
```powershell
mongosh
# эсвэл Docker дотор:
docker exec -it emed-mongodb mongosh
```
4. Firewall тохиргоо шалгах

### Module Not Found:

```powershell
# Dependencies дахин суулгах
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Permission Denied:

```powershell
# PowerShell-ийг Administrator эрхтэйгээр ажиллуулах
# Right-click PowerShell → Run as Administrator
```

### Docker Issues:

```powershell
# Docker Desktop ажиллаж байгаа эсэхийг шалгах
docker --version

# Container status шалгах
docker ps -a

# Container дахин эхлүүлэх
docker-compose restart
```

## 8. Development Workflow

### Terminal 1 - Backend:

```powershell
cd backend
npm run dev
```

### Terminal 2 - Frontend:

```powershell
cd frontend
npm run dev
```

### Terminal 3 - Database (хэрэв шаардлагатай):

```powershell
# Docker logs харах
docker-compose logs -f postgres
```

## 9. VS Code Extensions (Зөвлөмж)

- ESLint
- Prettier
- Thunder Client (API testing)
- PostgreSQL (database management)
- Docker

## 10. Next Steps

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

## Тусламж

Асуудал гарвал:
1. Error message-ийг анхаарах
2. Console logs шалгах
3. Database connection шалгах
4. Environment variables шалгах

