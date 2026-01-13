# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Features

### Authentication & Authorization

- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)

### API Security

- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation with express-validator
- MongoDB injection prevention (express-mongo-sanitize)
- Helmet.js security headers

### Data Protection

- Environment variables for secrets
- No sensitive data in logs
- Encrypted connections (HTTPS)
- Secure session management

### Security Headers

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy
- Strict-Transport-Security (HSTS)

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email security@emed.mn with details
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Best Practices

### For Developers

1. Never commit secrets to repository
2. Use environment variables
3. Keep dependencies updated
4. Review code before merging
5. Run security audits regularly

### For Deployment

1. Use strong passwords
2. Enable HTTPS
3. Configure firewall
4. Regular backups
5. Monitor logs
6. Update regularly

## Dependency Security

We use automated security scanning:

```bash
# Backend
cd backend && npm audit

# Frontend
cd frontend && npm audit
```

## Compliance

- GDPR compliant data handling
- Secure payment processing (Stripe, QPay)
- Certificate verification system
- User data encryption

## Security Updates

- Regular dependency updates
- Security patches applied promptly
- Security advisories published
- Changelog includes security fixes

