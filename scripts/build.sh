#!/bin/bash

# Production build script for e-med

set -e

echo "🚀 Starting production build..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo "⚠️  backend/.env not found. Copying from .env.example..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "⚠️  frontend/.env not found. Copying from .env.example..."
    cp frontend/.env.example frontend/.env
fi

# Build backend
echo -e "${BLUE}📦 Building backend...${NC}"
cd backend
npm ci --only=production
npm run lint || true
cd ..

# Build frontend
echo -e "${BLUE}📦 Building frontend...${NC}"
cd frontend
npm ci
npm run lint || true
npm run build
cd ..

echo -e "${GREEN}✅ Build completed successfully!${NC}"

