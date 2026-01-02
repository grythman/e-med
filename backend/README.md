# Backend API

Эмчийн сургалтын сайтын backend API (Node.js + Express + PostgreSQL)

## Бүтэц

```
backend/
├── config/          # Configuration files
│   └── database.js  # PostgreSQL connection
├── middleware/      # Express middleware
│   ├── auth.js     # Authentication middleware
│   └── validation.js # Input validation
├── routes/         # API routes
│   └── auth.js    # Authentication routes
├── utils/          # Utility functions
│   ├── jwt.js     # JWT token management
│   └── password.js # Password hashing
└── server.js       # Main server file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Health Check

- `GET /health` - Server health check
- `GET /api` - API information

## Security Features

- ✅ Helmet.js - Security headers
- ✅ Rate limiting - API protection
- ✅ CORS - Cross-origin resource sharing
- ✅ Input validation - express-validator
- ✅ Password hashing - bcrypt
- ✅ JWT authentication
- ✅ SQL injection prevention

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

## Environment Variables

See `.env.example` for required environment variables.

## Database

PostgreSQL database connection configured in `config/database.js`.

Required tables are created via migrations in `../database/migrations/`.

