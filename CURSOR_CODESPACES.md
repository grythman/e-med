# Cursor IDE дээр GitHub Codespace Холбох

## Cursor IDE гэж юу вэ?

Cursor нь VS Code-д суурилсан AI-powered code editor. VS Code-ийн бүх extension-ууд, features ажиллана.

## 1. GitHub Codespace Extension Суулгах

### Cursor дээр:

1. Cursor нээх
2. Extensions panel нээх (`Ctrl+Shift+X` эсвэл sidebar дээр Extensions icon)
3. "GitHub Codespaces" хайх
4. "GitHub Codespaces" extension суулгах (Microsoft-оос)

Эсвэл шууд:
- Extension ID: `GitHub.codespaces`

## 2. GitHub Authentication

### Эхний удаа:

1. Cursor дээр `Ctrl+Shift+P` (Command Palette)
2. "GitHub Codespaces: Sign in to GitHub" сонгох
3. Browser нээгдэж GitHub login хийх
4. Authorization зөвшөөрөх

### Authentication шалгах:

```bash
# Terminal дээр
gh auth status
```

## 3. Codespace Холбох

### Method 1: Command Palette (Зөвлөмж)

1. `Ctrl+Shift+P` дарах
2. "GitHub Codespaces: Connect to Codespace" сонгох
3. Codespace list-ээс сонгох эсвэл "Create New Codespace" дарах

### Method 2: GitHub Website-оос

1. GitHub repository-оо нээх
2. "Code" → "Codespaces" → "Create codespace on main"
3. Codespace үүсэх хүлээх
4. Cursor дээр:
   - `Ctrl+Shift+P`
   - "GitHub Codespaces: Connect to Codespace"
   - Үүссэн codespace-ийг сонгох

### Method 3: Direct URL

1. GitHub Codespaces website дээр codespace-ийн URL-ийг copy хийх
2. Cursor дээр:
   - `Ctrl+Shift+P`
   - "GitHub Codespaces: Connect to Codespace"
   - URL paste хийх

## 4. Codespace Үүсгэх (Cursor-оос)

### Repository-оос:

1. `Ctrl+Shift+P`
2. "GitHub Codespaces: Create New Codespace"
3. Repository сонгох
4. Branch сонгох (optional)
5. Machine type сонгох (2-core, 4-core, гэх мэт)
6. "Create" дарах

## 5. Codespace Management

### Codespace List Харах:

1. `Ctrl+Shift+P`
2. "GitHub Codespaces: List Codespaces"
3. Бүх codespace-ууд харагдана

### Codespace Stop/Start:

1. `Ctrl+Shift+P`
2. "GitHub Codespaces: Stop Current Codespace" эсвэл "Start Codespace"
3. Эсвэл GitHub website дээр manage хийх

### Codespace Delete:

1. `Ctrl+Shift+P`
2. "GitHub Codespaces: Delete Current Codespace"
3. Баталгаажуулах

## 6. Port Forwarding

### Автомат Port Forwarding:

Codespace холбогдсоны дараа port-ууд автоматаар forward хийгддэг.

### Port Management:

1. Cursor дээр "Ports" tab нээх (Terminal panel дээр)
2. Port-ууд харагдана:
   - 3000 (Frontend)
   - 5000 (Backend)
   - 5432 (PostgreSQL)
   - 6379 (Redis)

### Port Visibility Тохируулах:

1. Port дээр right-click
2. "Port Visibility" сонгох:
   - **Private**: Зөвхөн таны codespace-д хандах боломжтой
   - **Public**: Бүх хүнд хандах боломжтой (development-д зөвлөмж)

### Port URL:

Port-ууд дээр right-click → "Copy Local Address" эсвэл "Copy Public Address"

## 7. Terminal

### Terminal Нээх:

- `Ctrl+` ` (backtick) - Terminal нээх
- `Ctrl+Shift+5` - Terminal split

### Multiple Terminals:

Terminal panel дээр "+" товч дарах эсвэл `Ctrl+Shift+` ` 

## 8. Development Workflow

### 1. Codespace Холбох:

```bash
# Command Palette: "GitHub Codespaces: Connect to Codespace"
# Эсвэл GitHub website-оос codespace үүсгэх
```

### 2. Project Setup (автомат эсвэл manual):

```bash
# .devcontainer/post-create.sh автоматаар ажиллана
# Эсвэл manual:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Docker Compose:

```bash
docker compose up -d
```

### 4. Environment Variables:

```bash
# Backend .env
cd backend
cp .env.example .env
# .env файл засах

# Frontend .env
cd ../frontend
cp .env.example .env
# .env файл засах
```

### 5. Database Migrations:

```bash
docker compose exec postgres psql -U postgres -d emed -f /tmp/schema.sql
# Эсвэл local файлаас:
psql -h localhost -U postgres -d emed -f database/migrations/001_initial_schema.sql
```

### 6. Development Servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Browser дээр Нээх:

Ports tab дээр port-ууд дээр right-click → "Open in Browser"

## 9. Git Integration

### Git Commands:

```bash
# Status
git status

# Add
git add .

# Commit
git commit -m "Your message"

# Push
git push
```

### Cursor Source Control:

1. Source Control icon (`Ctrl+Shift+G`)
2. Changes харах
3. Stage/Commit/Push хийх

## 10. Extensions

### VS Code Extensions:

Cursor дээр VS Code extensions ажиллана:

- ESLint
- Prettier
- GitLens
- Docker
- PostgreSQL
- гэх мэт

### Extension Sync:

Settings Sync идэвхжүүлсэн бол extensions автоматаар sync хийгддэг.

## 11. Troubleshooting

### Codespace холбогдохгүй байна:

1. GitHub authentication шалгах:
   ```bash
   gh auth status
   ```

2. Extension суулгасан эсэхийг шалгах

3. Cursor restart хийх

4. GitHub website дээр codespace ажиллаж байгаа эсэхийг шалгах

### Port forwarding ажиллахгүй:

1. Ports tab нээх
2. Port visibility "Public" болгох
3. Port restart хийх

### Terminal ажиллахгүй:

1. Terminal panel нээх (`Ctrl+` `)
2. New terminal үүсгэх
3. Codespace reconnect хийх

### File sync асуудал:

1. File save хийх (`Ctrl+S`)
2. Auto-save идэвхжүүлэх (Settings → Auto Save)

## 12. Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | `Ctrl+Shift+P` |
| Terminal | `Ctrl+` ` |
| New Terminal | `Ctrl+Shift+` ` |
| Split Terminal | `Ctrl+Shift+5` |
| Source Control | `Ctrl+Shift+G` |
| Extensions | `Ctrl+Shift+X` |
| Ports Panel | Terminal panel дээр "Ports" tab |

## 13. Best Practices

1. **Auto-save**: Settings → Auto Save → "afterDelay"
2. **Port Visibility**: Development-д Public, Production-д Private
3. **Codespace Stop**: Хэрэглээгүй үед stop хийх (cost хэмнэх)
4. **Git Commit**: Тогтмол commit хийх
5. **Extensions**: Хэрэгтэй extensions суулгах

## 14. Cost Management

### Codespace Usage:

- Free tier: 60 hours/сар (2-core)
- Usage хянах: GitHub → Settings → Codespaces → Usage

### Cost хэмнэх:

1. Хэрэглээгүй үед codespace stop хийх
2. Auto-stop тохируулах (30 minutes)
3. Хамгийн бага machine type ашиглах (development-д)

## 15. Useful Commands

```bash
# Codespace info
echo $CODESPACE_NAME
echo $GITHUB_REPOSITORY

# Docker
docker compose ps
docker compose logs
docker compose restart

# Git
git status
git log --oneline
git branch
```

## Дараагийн Алхам

1. ✅ GitHub Codespaces extension суулгах
2. ✅ GitHub authentication
3. ✅ Codespace үүсгэх/холбох
4. ✅ Port forwarding тохируулах
5. ⏭️ Development эхлүүлэх

## Холбоос

- [Cursor IDE Documentation](https://cursor.sh/docs)
- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)

