# Аюулгүй Байдлын Шинжилгээ

## 1. Аюулгүй Байдлын Шаардлагууд

### 1.1 Хувийн Мэдээллийн Хамгаалалт

#### Монголын Хууль Тогтоомж:
- **Хувийн мэдээллийн хамгаалалтын хууль**: Шалгах шаардлагатай
- **GDPR Compliance**: Олон улсын хэрэглэгчдэд (хэрэв шаардлагатай)
- **Data Localization**: Мэдээллийг Монголд хадгалах шаардлага байгаа эсэх

#### Хэрэглэгчийн Мэдээлэл:
- **Email**: Хувийн мэдээлэл
- **Phone**: Хувийн мэдээлэл
- **Name**: Хувийн мэдээлэл
- **Payment Information**: Маш мэдрэмтгий мэдээлэл
- **Learning Progress**: Хувийн мэдээлэл

### 1.2 Эмнэлгийн Мэдээллийн Аюулгүй Байдал

#### Эмнэлгийн Мэдээлэл:
- **Course Completion**: Эмчийн сургалтын түвшин
- **Certificates**: Мэргэжлийн баталгаа
- **Quiz Results**: Мэдлэгийн үнэлгээ

#### HIPAA-тэй Ижил Төстэй Стандарт:
- Монголд HIPAA хэрэглэгддэггүй, гэхдээ ижил төстэй стандарт байж болно
- Монголын эмнэлгийн мэдээллийн аюулгүй байдлын хууль шалгах

## 2. Аюулгүй Байдлын Арга Хэмжээ

### 2.1 Authentication (Баталгаажуулалт)

#### Password Security:
```javascript
// Password hashing with bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Hash password
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### JWT Token Security:
```javascript
// JWT configuration
const jwtConfig = {
  accessToken: {
    expiresIn: '15m',  // Short-lived
    secret: process.env.JWT_ACCESS_SECRET
  },
  refreshToken: {
    expiresIn: '7d',   // Longer-lived
    secret: process.env.JWT_REFRESH_SECRET,
    httpOnly: true,     // Prevent XSS
    secure: true,       // HTTPS only
    sameSite: 'strict' // CSRF protection
  }
};
```

#### OAuth 2.0:
- Google OAuth
- Facebook OAuth (optional)
- Монголын social login (хэрэв байгаа бол)

#### Multi-Factor Authentication (MFA):
- **Phase 1**: Optional
- **Phase 2**: Required for teachers/admins
- **Methods**: 
  - SMS OTP
  - Email OTP
  - Authenticator App (Google Authenticator, Authy)

### 2.2 Authorization (Эрх Бүхий Хандалт)

#### Role-Based Access Control (RBAC):
```javascript
// Role definitions
const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

// Permission middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

#### Resource-Based Authorization:
- Teachers can only edit their own courses
- Students can only view enrolled courses
- Admins have full access

### 2.3 Data Encryption

#### Data at Rest:
```sql
-- PostgreSQL encryption
-- Use pgcrypto extension for column-level encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive data
INSERT INTO users (email, password_hash, phone_encrypted)
VALUES (
  'user@example.com',
  crypt('password', gen_salt('bf')),
  pgp_sym_encrypt('phone_number', 'encryption_key')
);
```

#### Data in Transit:
- **HTTPS/TLS**: Бүх API communication
- **SSL/TLS Certificate**: Let's Encrypt эсвэл commercial certificate
- **TLS Version**: Minimum TLS 1.2, recommended TLS 1.3

#### Database Connection:
```javascript
// Encrypted database connection
const dbConfig = {
  ssl: {
    require: true,
    rejectUnauthorized: false // For self-signed certificates
  }
};
```

### 2.4 API Security

#### Rate Limiting:
```javascript
// Express rate limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

#### Input Validation:
```javascript
// Joi validation
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(100).required()
});
```

#### SQL Injection Prevention:
- **Parameterized Queries**: Always use parameterized queries
- **ORM**: Use Sequelize, TypeORM эсвэл Prisma
- **Input Sanitization**: Sanitize all user inputs

#### XSS (Cross-Site Scripting) Prevention:
```javascript
// Helmet.js for security headers
const helmet = require('helmet');
app.use(helmet());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

#### CSRF (Cross-Site Request Forgery) Protection:
```javascript
// CSRF token
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Include CSRF token in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

### 2.5 File Upload Security

#### File Validation:
```javascript
// Multer configuration
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Only allow specific file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

#### Virus Scanning:
- ClamAV эсвэл commercial virus scanning service
- Scan all uploaded files before storage

#### File Storage:
- Store files in S3/Cloudflare R2 (not on server)
- Use signed URLs for temporary access
- Set appropriate file permissions

### 2.6 Video Security

#### Video Access Control:
```javascript
// Signed URLs for video access
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Generate signed URL (expires in 1 hour)
const videoUrl = s3.getSignedUrl('getObject', {
  Bucket: 'video-bucket',
  Key: videoKey,
  Expires: 3600
});
```

#### DRM (Digital Rights Management):
- **Phase 1**: Signed URLs (basic protection)
- **Phase 2**: DRM (хэрэв шаардлагатай)
- **Options**: 
  - AWS Elemental MediaPackage
  - Cloudflare Stream DRM

#### Video Watermarking:
- Add user-specific watermark to videos
- Prevent unauthorized sharing

### 2.7 Payment Security

#### PCI DSS Compliance:
- **Do NOT store credit card information**
- Use payment gateway (Stripe, PayPal)
- Tokenize payment information

#### Payment Gateway Integration:
```javascript
// Stripe integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: amount * 100, // Convert to cents
  currency: 'mnt',
  metadata: {
    userId: user.id,
    courseId: course.id
  }
});
```

#### Webhook Security:
```javascript
// Verify webhook signature
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

## 3. Security Headers

### 3.1 HTTP Security Headers

```javascript
// Helmet.js configuration
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
```

## 4. Logging & Monitoring

### 4.1 Security Logging

#### What to Log:
- Authentication attempts (success/failure)
- Authorization failures
- Payment transactions
- File uploads
- Admin actions
- API errors
- Suspicious activities

#### Log Format:
```javascript
// Winston logger
const logger = require('winston');

logger.info('User login', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.get('user-agent'),
  timestamp: new Date()
});

logger.warn('Failed login attempt', {
  email: req.body.email,
  ip: req.ip,
  userAgent: req.get('user-agent'),
  timestamp: new Date()
});
```

### 4.2 Security Monitoring

#### Intrusion Detection:
- Monitor failed login attempts
- Detect brute force attacks
- Monitor unusual API usage patterns
- Detect SQL injection attempts
- Monitor file upload patterns

#### Alerting:
- Email alerts for security events
- SMS alerts for critical events (optional)
- Integration with monitoring tools (Sentry, Datadog)

## 5. Backup & Disaster Recovery

### 5.1 Data Backup

#### Database Backup:
- **Daily backups**: Automated daily backups
- **Retention**: Keep backups for 30 days
- **Encryption**: Encrypt backup files
- **Off-site storage**: Store backups in different location

#### File Backup:
- S3 versioning enabled
- Cross-region replication (optional)

### 5.2 Disaster Recovery Plan

#### Recovery Time Objective (RTO):
- **Target**: < 4 hours
- **Maximum**: < 24 hours

#### Recovery Point Objective (RPO):
- **Target**: < 1 hour data loss
- **Maximum**: < 24 hours data loss

## 6. Compliance Checklist

### 6.1 General Security

- [ ] HTTPS/TLS enabled
- [ ] Strong password policy
- [ ] JWT token security
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security headers (Helmet.js)
- [ ] File upload security
- [ ] Error handling (no sensitive data in errors)

### 6.2 Data Protection

- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Password hashing (bcrypt)
- [ ] Secure session management
- [ ] Access control (RBAC)
- [ ] Audit logging
- [ ] Data backup strategy
- [ ] Privacy policy
- [ ] Terms of service

### 6.3 Payment Security

- [ ] PCI DSS compliance
- [ ] Payment gateway integration
- [ ] No credit card storage
- [ ] Webhook signature verification
- [ ] Payment logging

### 6.4 Video Security

- [ ] Signed URLs for video access
- [ ] Access control
- [ ] Watermarking (optional)
- [ ] DRM (optional, Phase 2)

## 7. Security Testing

### 7.1 Penetration Testing

#### Tools:
- **OWASP ZAP**: Web application security scanner
- **Burp Suite**: Web vulnerability scanner
- **Nmap**: Network security scanner

#### Testing Areas:
- Authentication bypass
- Authorization flaws
- SQL injection
- XSS vulnerabilities
- CSRF vulnerabilities
- File upload vulnerabilities
- API security

### 7.2 Code Security Scanning

#### Tools:
- **Snyk**: Dependency vulnerability scanning
- **npm audit**: npm package vulnerabilities
- **ESLint security plugins**: Code security linting

## 8. Дүгнэлт

### Гол Аюулгүй Байдлын Арга Хэмжээ:

1. **Authentication**: 
   - Strong password hashing (bcrypt)
   - JWT tokens with short expiration
   - MFA (optional Phase 1, required Phase 2)

2. **Authorization**:
   - RBAC implementation
   - Resource-based access control

3. **Data Protection**:
   - Encryption at rest and in transit
   - Secure database connections
   - Input validation and sanitization

4. **API Security**:
   - Rate limiting
   - Input validation
   - Security headers
   - CSRF protection

5. **Payment Security**:
   - PCI DSS compliance
   - Payment gateway integration
   - No credit card storage

6. **Monitoring**:
   - Security logging
   - Intrusion detection
   - Alerting

7. **Compliance**:
   - Монголын хууль тогтоомж
   - Privacy policy
   - Terms of service

### Зөвлөмж:

- **Phase 1**: Basic security measures (authentication, authorization, encryption)
- **Phase 2**: Advanced security (MFA, DRM, advanced monitoring)
- **Regular Security Audits**: Жилийн 1-2 удаа security audit хийх
- **Security Training**: Багийн гишүүдэд security training өгөх







