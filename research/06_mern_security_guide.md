# MERN Stack-д Аюулгүй Байдлыг Хангах Бүрэн Гарын Авлага

## Дүгнэлт: Тийм ээ, MERN Stack-д аюулгүй байдлыг бүрэн хангаж болно!

MERN stack нь аюулгүй байдлыг хангах бүх хэрэгсэл, library, best practices-тэй. Зөвхөн зөв implementation хийх шаардлагатай.

## 1. MERN Stack-д Аюулгүй Байдлын Давуу Талууд

### 1.1 JavaScript Ecosystem-ийн Аюулгүй Байдлын Хэрэгслүүд

#### Олон Түгээмэл Library-ууд:
- **helmet.js**: Security headers
- **express-rate-limit**: Rate limiting
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT tokens
- **express-validator**: Input validation
- **cors**: CORS configuration
- **express-mongo-sanitize**: MongoDB injection prevention

#### Active Community:
- Олон улсын developer community
- Тогтмол security updates
- Олон security best practices guide

### 1.2 Node.js Security Features

- **Built-in crypto module**: Encryption, hashing
- **HTTPS/TLS support**: Secure connections
- **Process isolation**: Sandboxing capabilities

## 2. Практик Аюулгүй Байдлын Implementation

### 2.1 Backend Security (Node.js + Express)

#### Package.json Dependencies:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-mongo-sanitize": "^2.2.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  }
}
```

#### Security Middleware Setup:
```javascript
// server.js
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();

// 1. Helmet - Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https://*.cloudflare.com"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "no-referrer" }
}));

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 3. CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Body Parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. MongoDB Injection Prevention
app.use(mongoSanitize());

// 6. Compression
app.use(compression());

// 7. Environment Variables Validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

module.exports = app;
```

### 2.2 Authentication & Authorization

#### Password Hashing with bcrypt:
```javascript
// utils/password.js
const bcrypt = require('bcrypt');

const saltRounds = 12;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
```

#### JWT Token Management:
```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'emed-api',
    audience: 'emed-client'
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'emed-api',
    audience: 'emed-client'
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'emed-api',
      audience: 'emed-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'emed-api',
      audience: 'emed-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
```

#### Authentication Middleware:
```javascript
// middleware/auth.js
const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    
    // Verify user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
```

### 2.3 Input Validation

#### Express-Validator Setup:
```javascript
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number and special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};
```

### 2.4 Database Security (MongoDB/PostgreSQL)

#### MongoDB Injection Prevention:
```javascript
// Already handled by express-mongo-sanitize middleware
// But also use parameterized queries:

// ❌ BAD - Vulnerable to injection
const user = await User.findOne({ email: req.body.email });

// ✅ GOOD - Safe
const user = await User.findOne({ 
  email: req.body.email // express-mongo-sanitize handles this
});

// ✅ BETTER - Explicit validation
const { email } = req.body;
const sanitizedEmail = email.trim().toLowerCase();
const user = await User.findOne({ email: sanitizedEmail });
```

#### PostgreSQL Parameterized Queries:
```javascript
// Using pg library
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ❌ BAD - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ GOOD - Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [email]);
```

### 2.5 File Upload Security

#### Multer Configuration:
```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/pdf': '.pdf'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter
});

// Virus scanning (if using ClamAV)
const scanFile = async (buffer) => {
  // Implement virus scanning logic
  // This is a placeholder - implement actual virus scanning
  return { isSafe: true };
};

module.exports = {
  upload,
  scanFile
};
```

### 2.6 API Security Best Practices

#### Error Handling (No Information Leakage):
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Don't expose internal errors to client
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  // Generic error message
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;
```

#### Request Logging:
```javascript
// middleware/logger.js
const morgan = require('morgan');

// Custom format that doesn't log sensitive data
const customFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';

const logger = morgan(customFormat, {
  skip: (req, res) => {
    // Don't log sensitive endpoints
    return req.path.includes('/auth') || req.path.includes('/payment');
  }
});

module.exports = logger;
```

## 3. Frontend Security (React)

### 3.1 Environment Variables

#### .env.example:
```env
REACT_APP_API_URL=https://api.emed.mn
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

#### Never expose secrets:
```javascript
// ❌ BAD - Never do this
const API_KEY = 'sk_live_...';

// ✅ GOOD - Use environment variables
const API_URL = process.env.REACT_APP_API_URL;
```

### 3.2 Token Storage

#### Secure Token Storage:
```javascript
// utils/auth.js
// Option 1: httpOnly cookies (most secure, requires backend support)
// Backend sets cookie with httpOnly flag

// Option 2: localStorage (less secure, but common)
const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

const getToken = () => {
  return localStorage.getItem('accessToken');
};

const removeToken = () => {
  localStorage.removeItem('accessToken');
};

// Option 3: Memory storage (most secure for SPA, but lost on refresh)
let token = null;
const setTokenInMemory = (newToken) => {
  token = newToken;
};
```

### 3.3 API Client with Security

#### Axios Configuration:
```javascript
// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 3.4 XSS Prevention

#### React automatically escapes:
```javascript
// React automatically escapes content
function UserProfile({ userName }) {
  // ✅ Safe - React escapes automatically
  return <div>{userName}</div>;
  
  // ⚠️ Dangerous - Only use if you trust the content
  return <div dangerouslySetInnerHTML={{ __html: userName }} />;
}
```

#### Sanitize user input:
```javascript
// utils/sanitize.js
import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty);
};
```

## 4. Security Checklist for MERN Stack

### 4.1 Backend Checklist

- [ ] Helmet.js configured with CSP
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Password hashing with bcrypt (12+ rounds)
- [ ] JWT tokens with short expiration
- [ ] Refresh token rotation
- [ ] SQL/NoSQL injection prevention
- [ ] File upload validation and scanning
- [ ] Error handling (no information leakage)
- [ ] Environment variables for secrets
- [ ] HTTPS/TLS enabled
- [ ] Security headers (HSTS, X-Frame-Options, etc.)
- [ ] Logging and monitoring
- [ ] Regular dependency updates

### 4.2 Frontend Checklist

- [ ] Environment variables for config
- [ ] Secure token storage
- [ ] API client with interceptors
- [ ] XSS prevention (no dangerouslySetInnerHTML)
- [ ] CSRF protection (if using cookies)
- [ ] Input validation
- [ ] Error handling
- [ ] Content Security Policy compliance

### 4.3 Database Checklist

- [ ] Parameterized queries
- [ ] Connection encryption (SSL/TLS)
- [ ] Database user with minimal privileges
- [ ] Regular backups
- [ ] Backup encryption
- [ ] Access logging

## 5. Security Monitoring & Maintenance

### 5.1 Dependency Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Use Snyk for continuous monitoring
npx snyk test
```

### 5.2 Security Headers Testing

```bash
# Test security headers
curl -I https://api.emed.mn

# Check with securityheaders.com
# https://securityheaders.com/?q=https://api.emed.mn
```

### 5.3 Regular Security Updates

- **Weekly**: Check npm audit
- **Monthly**: Review security logs
- **Quarterly**: Security audit
- **Annually**: Penetration testing

## 6. MERN vs Django Security Comparison

| Security Feature | MERN Stack | Django |
|-----------------|------------|--------|
| Built-in Security | ⭐⭐⭐ (Libraries needed) | ⭐⭐⭐⭐⭐ (Built-in) |
| CSRF Protection | ⭐⭐⭐ (Manual setup) | ⭐⭐⭐⭐⭐ (Automatic) |
| XSS Protection | ⭐⭐⭐⭐ (React auto-escapes) | ⭐⭐⭐⭐⭐ (Template auto-escapes) |
| SQL Injection | ⭐⭐⭐⭐ (ORM/Parameterized) | ⭐⭐⭐⭐⭐ (ORM) |
| Authentication | ⭐⭐⭐⭐ (JWT libraries) | ⭐⭐⭐⭐⭐ (Built-in) |
| Input Validation | ⭐⭐⭐⭐ (express-validator) | ⭐⭐⭐⭐⭐ (Forms) |
| Security Headers | ⭐⭐⭐⭐ (Helmet.js) | ⭐⭐⭐⭐ (Middleware) |
| **Overall** | **⭐⭐⭐⭐** | **⭐⭐⭐⭐⭐** |

## 7. Дүгнэлт

### MERN Stack-д аюулгүй байдлыг бүрэн хангаж болно!

**Давуу талууд**:
- Олон security library байдаг
- Active community support
- Best practices тодорхой
- Зөв implementation хийвэл маш аюулгүй

**Анхаарах зүйлс**:
- Security library-уудыг зөв ашиглах
- Regular updates хийх
- Security best practices дагах
- Regular security audits хийх

**Зөвлөмж**:
1. **Helmet.js** - Security headers
2. **express-rate-limit** - Rate limiting
3. **bcrypt** - Password hashing
4. **express-validator** - Input validation
5. **express-mongo-sanitize** - Injection prevention
6. **Regular npm audit** - Vulnerability scanning
7. **HTTPS/TLS** - Encrypted connections
8. **Environment variables** - Secret management

**Эцсийн дүгнэлт**: MERN stack сонгоод аюулгүй байдлыг бүрэн хангаж болно. Зөвхөн зөв library-ууд ашиглаж, best practices дагах шаардлагатай.

