# GitHub Codespaces дээр Суулгах Зааварчилгаа

## GitHub Codespaces гэж юу вэ?

GitHub Codespaces нь cloud-based development environment бөгөөд VS Code-тэй ижил интерфейстэй. Бүх хэрэгслүүд бэлэн байдаг.

## Давуу Талууд

- ✅ Pre-installed tools (Node.js, Docker, Git, гэх мэт)
- ✅ VS Code интерфейс
- ✅ Автомат port forwarding
- ✅ GitHub integration
- ✅ Хэрэглэгч бүрт өөрийн environment
- ✅ Windows, Mac, Linux дээр ажиллана

## 1. Codespace Үүсгэх

### GitHub Repository-оос:

1. GitHub repository-оо нээх
2. "Code" товч дарах
3. "Codespaces" tab сонгох
4. "Create codespace on main" эсвэл "New codespace" дарах
5. Codespace үүсэх хүлээх (1-2 минут)

### Эсвэл GitHub CLI ашиглах:

```bash
gh codespace create --repo <your-username>/e-med
```

## 2. Pre-installed Tools Шалгах

Codespace нээгдсэний дараа terminal дээр:

```bash
# Node.js шалгах
node --version  # v18+ байх ёстой

# npm шалгах
npm --version

# Docker шалгах
docker --version

# Docker Compose шалгах
docker compose version

# Git шалгах
git --version

# PostgreSQL client шалгах (хэрэв байвал)
psql --version
```

## 3. Project Setup

### Dependencies Суулгах:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 4. Environment Variables Тохируулах

### Option 1: Codespaces Secrets (Production values-д зөвлөмж)

1. GitHub repository-оо нээх
2. Settings → Secrets and variables → Codespaces
3. "New repository secret" дарах
4. Дараах secrets нэмэх:
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `DATABASE_URL` (хэрэв шаардлагатай бол)
   - `STRIPE_SECRET_KEY` (хэрэв шаардлагатай бол)

Codespaces дээр secrets-ууд автоматаар environment variables болж ирнэ.

### Option 2: .env файл (Development-д зөвлөмж)

```bash
# Backend .env
cd backend
cp .env.example .env
code .env  # эсвэл nano .env
```

`.env` файлд:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=https://<your-codespace-url>-3000.app.github.dev

# Docker Compose ашиглаж байгаа тул localhost ашиглах
DATABASE_URL=postgresql://postgres:password@localhost:5432/emed
REDIS_URL=redis://localhost:6379

# JWT Secrets (Codespaces secrets-аас авна эсвэл local утга)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12
```

```bash
# Frontend .env
cd ../frontend
cp .env.example .env
code .env
```

`.env` файлд:

```env
# Codespace URL-ийг олох: Ports tab дээр backend port-ийг нээх
# Жишээ: https://your-codespace-5000.app.github.dev
VITE_API_URL=https://<your-codespace-url>-5000.app.github.dev/api
VITE_APP_NAME=e-med
```

**Анхаар**: `.env` файлуудыг `.gitignore` дээр байгаа тул commit хийхгүй.

## 5. Database Setup (Docker Compose)

### Docker Compose эхлүүлэх:

```bash
# Project root directory дээр
docker compose up -d

# Containers ажиллаж байгаа эсэхийг шалгах
docker compose ps

# Logs шалгах
docker compose logs
```

### Database Migrations:

```bash
# PostgreSQL-д холбогдох
docker compose exec postgres psql -U postgres -d emed -f /path/to/migrations/001_initial_schema.sql

# Эсвэл local файлаас:
# Migrations файлыг Codespace дээр байрлуулах
psql -h localhost -U postgres -d emed -f database/migrations/001_initial_schema.sql
# Password: password
```

### Эсвэл Docker exec ашиглах:

```bash
# SQL файлыг container дээр copy хийх
docker compose cp database/migrations/001_initial_schema.sql postgres:/tmp/schema.sql

# Migrations ажиллуулах
docker compose exec postgres psql -U postgres -d emed -f /tmp/schema.sql
```

## 6. Port Forwarding

### Автомат Port Forwarding:

Codespaces нь автоматаар port forwarding хийгддэг. Ports tab дээр:

1. VS Code sidebar дээр "Ports" tab нээх
2. Backend (5000) ба Frontend (3000) port-ууд автоматаар forward хийгдсэн байх
3. Port-ууд дээр right-click → "Port Visibility" → "Public" сонгох (хэрэв шаардлагатай бол)

### Port URL-ууд:

- Backend: `https://<your-codespace-url>-5000.app.github.dev`
- Frontend: `https://<your-codespace-url>-3000.app.github.dev`

Эдгээр URL-уудыг `.env` файлд ашиглах.

## 7. Development Server Эхлүүлэх

### Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Backend `http://localhost:5000` дээр ажиллана (Codespace дотор).

### Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:3000` дээр ажиллана (Codespace дотор).

### Browser дээр Нээх:

Ports tab дээр port-ууд дээр right-click → "Open in Browser" эсвэл URL-ийг шууд browser дээр нээх.

## 8. Codespaces Configuration

### .devcontainer/devcontainer.json (Optional):

Repository дээр `.devcontainer/devcontainer.json` файл үүсгэж, Codespace-ийг тохируулах:

```json
{
  "name": "e-med Development",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/postgres:1": {
      "version": "15"
    }
  },
  "forwardPorts": [3000, 5000, 5432, 6379],
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  }
}
```

Энэ нь Codespace үүсэхэд автоматаар тохируулагдана.

## 9. GitHub Integration

### Git Configuration:

```bash
# Git тохируулах (аль хэдийн тохируулагдсан байх)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Changes Commit хийх:

```bash
# Changes шалгах
git status

# Add хийх
git add .

# Commit хийх
git commit -m "Your commit message"

# Push хийх
git push
```

## 10. Codespaces Features

### Multiple Terminals:

- `Ctrl+Shift+` ` (backtick) - Terminal нээх
- `Ctrl+Shift+5` - Split terminal

### Port Forwarding:

- Ports tab дээр port-уудыг manage хийх
- Public/Private visibility тохируулах
- Port label өөрчлөх

### Extensions:

VS Code extensions автоматаар sync хийгддэг (хэрэв Settings Sync идэвхжсэн бол).

## 11. Troubleshooting

### Port already in use:

```bash
# Port ашиглаж байгаа process олох
lsof -i :5000
lsof -i :3000

# Process устгах
kill -9 <PID>
```

### Docker issues:

```bash
# Docker service эхлүүлэх
sudo service docker start

# Docker Compose restart
docker compose down
docker compose up -d
```

### Database connection:

```bash
# PostgreSQL connection шалгах
docker compose exec postgres psql -U postgres -d emed -c "SELECT version();"

# Redis connection шалгах
docker compose exec redis redis-cli ping
```

### Environment variables:

```bash
# Environment variables шалгах
echo $JWT_SECRET
echo $DATABASE_URL

# Codespaces secrets шалгах
# Settings → Secrets and variables → Codespaces
```

### Node modules:

```bash
# node_modules устгаж дахин суулгах
rm -rf node_modules package-lock.json
npm install
```

## 12. Cost Management

### Codespaces Usage:

- Free tier: 60 hours/сар (2-core machine)
- Usage хянах: GitHub → Settings → Codespaces → Usage

### Cost хэмнэх:

1. Codespace-ийг зөвхөн хэрэгтэй үед ашиглах
2. Хэрэглээгүй үед stop хийх
3. Auto-stop тохируулах (30 minutes inactivity)

### Codespace Stop/Delete:

```bash
# VS Code Command Palette (Ctrl+Shift+P)
# "Codespaces: Stop Current Codespace"
# "Codespaces: Delete Current Codespace"
```

Эсвэл GitHub website дээр:
- Settings → Codespaces → Codespace list
- Stop эсвэл Delete дарах

## 13. Best Practices

1. **.env файлууд**: `.gitignore` дээр байгаа эсэхийг шалгах
2. **Secrets**: Мэдрэмтгий мэдээллийг Codespaces secrets-д хадгалах
3. **Port Visibility**: Development-д Public, Production-д Private
4. **Auto-save**: VS Code auto-save идэвхжүүлэх
5. **Extensions**: Хэрэгтэй extensions суулгах

## 14. Useful Commands

```bash
# Codespace info
echo $CODESPACE_NAME
echo $GITHUB_REPOSITORY

# Port URL олох
# Ports tab дээр харагдана

# Docker Compose commands
docker compose up -d          # Start
docker compose down          # Stop
docker compose ps            # Status
docker compose logs          # Logs
docker compose restart       # Restart
```

## Дараагийн Алхам

1. ✅ Codespace үүсгэх
2. ✅ Dependencies суулгах
3. ✅ Environment variables тохируулах
4. ✅ Docker Compose эхлүүлэх
5. ✅ Database migrations
6. ⏭️ Development эхлүүлэх

## Холбоос

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Codespaces Pricing](https://github.com/features/codespaces)
- [VS Code in Browser](https://code.visualstudio.com/docs/remote/codespaces)



