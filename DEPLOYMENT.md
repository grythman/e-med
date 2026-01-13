# Deployment Guide

Энэхүү баримт бичигт e-med төслийг production environment-д deploy хийх зааварчилгаа багтсан.

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (development only)
- MongoDB 7+
- Redis 7+
- Domain name (optional, for production)

## Quick Start

### Development

```bash
# Clone repository
git clone <repository-url>
cd e-med

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production

```bash
# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Environment Variables

### Backend (.env)

```bash
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/emed?authSource=admin
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Optional
REDIS_HOST=redis
REDIS_PORT=6379
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)

```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_SITE_URL=https://yourdomain.com
```

## Docker Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Run Services

```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

### Database

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password

# Backup database
./scripts/backup.sh

# Restore database
docker-compose exec -T mongodb mongorestore --archive < backup.tar.gz
```

## Production Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin
```

### 2. Application Setup

```bash
# Clone repository
git clone <repository-url>
cd e-med

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with production values

cp frontend/.env.example frontend/.env
# Edit frontend/.env with production values
```

### 3. Deploy

```bash
# Build and start
docker-compose up -d --build

# Or use deployment script
./scripts/deploy.sh
```

### 4. Nginx Reverse Proxy (Optional)

```nginx
# /etc/nginx/sites-available/emed
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

### Health Checks

- Backend: `http://localhost:5000/health`
- Frontend: `http://localhost:3000/health`

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100 backend
```

### Database Backup

```bash
# Manual backup
./scripts/backup.sh

# Automated backup (cron)
0 2 * * * /path/to/emed/scripts/backup.sh
```

## CI/CD

GitHub Actions workflows are configured:

- **CI Pipeline** (`ci.yml`): Runs on push/PR
  - Backend tests
  - Frontend tests
  - Linting
  - Security scans

- **Deploy Pipeline** (`deploy.yml`): Runs on main branch
  - Builds Docker images
  - Pushes to Docker Hub
  - Deploys to server (configure secrets)

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check service status
docker-compose ps

# Restart services
docker-compose restart
```

### Database connection issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check connection string in .env
# Ensure credentials match docker-compose.yml
```

### Port conflicts

Edit `docker-compose.yml` to change ports:

```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up regular backups
- [ ] Enable rate limiting
- [ ] Review security headers
- [ ] Update dependencies regularly

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
```

### Load Balancer

Use Nginx or Traefik as load balancer for multiple backend instances.

## Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Update Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix
```

### Database Migration

```bash
docker-compose exec backend npm run migrate
```

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review documentation
- Open GitHub issue

