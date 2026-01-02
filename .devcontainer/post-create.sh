#!/bin/bash

echo "🚀 Setting up e-med development environment..."

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your configuration"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env from .env.example..."
    cp frontend/.env.example frontend/.env
    echo "⚠️  Please update frontend/.env with your configuration"
fi

# Start Docker Compose
echo "🐳 Starting Docker Compose..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run database migrations
echo "🗄️  Running database migrations..."
if [ -f database/migrations/001_initial_schema.sql ]; then
    docker compose exec -T postgres psql -U postgres -d emed -f - < database/migrations/001_initial_schema.sql || echo "⚠️  Migration failed - you may need to run it manually"
else
    echo "⚠️  Migration file not found"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env and frontend/.env with your configuration"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open ports in the Ports tab"


