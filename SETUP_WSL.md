# WSL (Windows Subsystem for Linux) дээр Суулгах Зааварчилгаа

## Шаардлагууд

- Windows 10/11
- WSL 2 суулгасан
- Ubuntu эсвэл бусад Linux distribution WSL дээр

## 1. WSL Setup Шалгах

### WSL 2 суулгасан эсэхийг шалгах:

```bash
# PowerShell эсвэл Command Prompt дээр
wsl --list --verbose

# WSL 2 байхгүй бол суулгах
wsl --install
```

### WSL-д Ubuntu эсвэл бусад distribution суулгах:

```bash
# PowerShell дээр
wsl --install -d Ubuntu-22.04
```

## 2. WSL дээр Node.js Суулгах

### NVM (Node Version Manager) ашиглах (Зөвлөмж):

```bash
# WSL terminal дээр
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Terminal дахин нээх эсвэл:
source ~/.bashrc

# Node.js 18+ суулгах
nvm install 18
nvm use 18
nvm alias default 18

# Шалгах
node --version
npm --version
```

### Эсвэл Direct суулгах:

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Шалгах
node --version
npm --version
```

## 3. PostgreSQL Суулгах

### Option 1: Docker ашиглах (Зөвлөмж)

```bash
# Docker Desktop for Windows суулгах эсвэл
# WSL дээр Docker суулгах

# Docker суулгах (WSL дээр)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose суулгах
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Docker service эхлүүлэх
sudo service docker start

# User-г docker group-д нэмэх
sudo usermod -aG docker $USER
# Terminal дахин нээх шаардлагатай

# Шалгах
docker --version
docker compose version
```

### Option 2: PostgreSQL Direct суулгах

```bash
# PostgreSQL суулгах
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL service эхлүүлэх
sudo service postgresql start

# PostgreSQL user үүсгэх
sudo -u postgres psql

# PostgreSQL дээр:
CREATE DATABASE emed;
CREATE USER emed_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE emed TO emed_user;
\q
```

## 4. Redis Суулгах

### Option 1: Docker ашиглах (Зөвлөмж)

Docker Compose ашиглавал Redis автоматаар сууна.

### Option 2: Redis Direct суулгах

```bash
# Redis суулгах
sudo apt update
sudo apt install redis-server

# Redis service эхлүүлэх
sudo service redis-server start

# Шалгах
redis-cli ping
# "PONG" гэж хариу ирнэ
```

## 5. Project Setup

### Project файлуудыг WSL дээр байрлуулах:

**Анхаар**: Windows файл систем (`/mnt/c/`) дээр байрлуулахаас илүү WSL файл систем (`~/`) дээр байрлуулах нь илүү хурдан.

```bash
# WSL home directory дээр project үүсгэх
cd ~
git clone <your-repo-url> e-med
cd e-med

# Эсвэл Windows файл систем дээр байвал:
cd /mnt/d/e-med
```

### Dependencies суулгах:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 6. Environment Variables Тохируулах

### Backend .env файл:

```bash
cd backend
cp .env.example .env
nano .env  # эсвэл code .env
```

`.env` файлд:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Docker ашиглаж байвал:
DATABASE_URL=postgresql://postgres:password@localhost:5432/emed
REDIS_URL=redis://localhost:6379

# Эсвэл direct PostgreSQL ашиглаж байвал:
DATABASE_URL=postgresql://emed_user:your_password@localhost:5432/emed

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12
```

### Frontend .env файл:

```bash
cd frontend
cp .env.example .env
nano .env
```

`.env` файлд:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=e-med
```

## 7. Database Setup

### Docker ашиглаж байвал:

```bash
# Project root directory дээр
docker compose up -d

# Database migrations ажиллуулах
# PostgreSQL-д холбогдох
psql -h localhost -U postgres -d emed -f database/migrations/001_initial_schema.sql
# Password: password
```

### Direct PostgreSQL ашиглаж байвал:

```bash
# Migrations ажиллуулах
psql -U emed_user -d emed -f database/migrations/001_initial_schema.sql
# Password: your_password
```

## 8. Development Server Эхлүүлэх

### Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Backend `http://localhost:5000` дээр ажиллана.

### Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:3000` дээр ажиллана.

## 9. Windows Browser дээр Нээх

WSL дээр ажиллаж буй server-үүдийг Windows browser дээр `http://localhost:3000` эсвэл `http://localhost:5000` гэж нээж болно.

## 10. WSL-ийн Онцлог

### Port Forwarding:

WSL 2 нь автоматаар port forwarding хийгддэг. Хэрэв асуудал гарвал:

```bash
# Windows PowerShell дээр (Admin эрхтэй)
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=<WSL_IP>
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=<WSL_IP>

# WSL IP хаягийг олох:
wsl hostname -I
```

### File Permissions:

Windows файл систем дээр байгаа файлууд дээр permission асуудал гарч болно. WSL файл систем дээр байрлуулах нь илүү сайн.

### Git Configuration:

```bash
# Git тохируулах
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Windows credential manager ашиглах
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

## 11. VS Code ашиглах

### WSL Remote Extension:

1. VS Code дээр "Remote - WSL" extension суулгах
2. WSL terminal дээр:
```bash
code .
```

Эсвэл VS Code дээр:
- `Ctrl+Shift+P`
- "WSL: Connect to WSL"
- Ubuntu сонгох

## 12. Troubleshooting

### Port already in use:

```bash
# Port ашиглаж байгаа process олох
sudo lsof -i :5000
sudo lsof -i :3000

# Process устгах
sudo kill -9 <PID>
```

### Database connection алдаа:

```bash
# PostgreSQL ажиллаж байгаа эсэхийг шалгах
sudo service postgresql status

# Эхлүүлэх
sudo service postgresql start

# Connection шалгах
psql -U postgres -d emed -c "SELECT version();"
```

### Docker permission алдаа:

```bash
# User-г docker group-д нэмэх
sudo usermod -aG docker $USER

# Terminal дахин нээх
exit
# WSL дахин нээх
```

### Node modules алдаа:

```bash
# node_modules устгаж дахин суулгах
rm -rf node_modules package-lock.json
npm install
```

## 13. Performance Tips

1. **WSL файл систем ашиглах**: Windows файл систем (`/mnt/c/`) дээр байгаа файлууд удаан ажиллана. WSL файл систем (`~/`) дээр байрлуулах.

2. **WSL 2 ашиглах**: WSL 1-ээс илүү хурдан.

3. **Memory limit тохируулах**: `.wslconfig` файл үүсгэх:
```ini
# C:\Users\<YourUsername>\.wslconfig
[wsl2]
memory=4GB
processors=2
```

## 14. Useful Commands

```bash
# WSL version шалгах
wsl --list --verbose

# WSL restart хийх
wsl --shutdown
# Дараа нь дахин нээх

# WSL IP хаяг олох
hostname -I

# Windows IP хаяг олох (WSL дээр)
cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
```

## Дараагийн Алхам

1. ✅ WSL setup
2. ✅ Node.js, PostgreSQL, Redis суулгах
3. ✅ Project setup
4. ✅ Database migrations
5. ⏭️ Development эхлүүлэх

## Холбоос

- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Desktop WSL 2 Backend](https://docs.docker.com/desktop/windows/wsl/)
- [VS Code Remote WSL](https://code.visualstudio.com/docs/remote/wsl)






