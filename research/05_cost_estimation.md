# Зардлын Тооцоо

## 1. Хөгжүүлэлтийн Зардал

### 1.1 Багийн Бүтэц

#### Phase 1 (MVP - 3-4 сар):
- **Full-stack Developer**: 1 хүн (MERN stack)
- **UI/UX Designer**: 1 хүн (хэсэг хугацаа)
- **Project Manager**: 1 хүн (хэсэг хугацаа)

#### Phase 2 (Advanced Features - 2-3 сар):
- **Full-stack Developer**: 1 хүн
- **Mobile Developer**: 1 хүн (React Native)
- **UI/UX Designer**: 1 хүн (хэсэг хугацаа)

#### Phase 3 (Mobile & Integrations - 2 сар):
- **Mobile Developer**: 1 хүн
- **Backend Developer**: 1 хүн (интеграци)

### 1.2 Хөгжүүлэлтийн Зардлын Тооцоо

#### Монголын Зах Зээлийн Үнэ (ойролцоогоор):

**Full-stack Developer**:
- **Senior**: $1,500 - $2,500/сар
- **Mid-level**: $800 - $1,500/сар
- **Junior**: $400 - $800/сар

**Mobile Developer**:
- **Senior**: $1,500 - $2,500/сар
- **Mid-level**: $800 - $1,500/сар

**UI/UX Designer**:
- **Senior**: $1,000 - $2,000/сар
- **Mid-level**: $600 - $1,200/сар

**Project Manager**:
- **Senior**: $1,200 - $2,000/сар
- **Mid-level**: $800 - $1,500/сар

#### Phase 1 Зардал (MVP):
- Full-stack Developer (Mid): $1,200/сар × 4 сар = **$4,800**
- UI/UX Designer (хэсэг): $800/сар × 2 сар = **$1,600**
- Project Manager (хэсэг): $1,000/сар × 2 сар = **$2,000**
- **Нийт**: **$8,400**

#### Phase 2 Зардал (Advanced Features):
- Full-stack Developer: $1,200/сар × 3 сар = **$3,600**
- Mobile Developer: $1,200/сар × 2 сар = **$2,400**
- UI/UX Designer (хэсэг): $800/сар × 1 сар = **$800**
- **Нийт**: **$6,800**

#### Phase 3 Зардал (Mobile & Integrations):
- Mobile Developer: $1,200/сар × 2 сар = **$2,400**
- Backend Developer: $1,200/сар × 2 сар = **$2,400**
- **Нийт**: **$4,800**

#### Нийт Хөгжүүлэлтийн Зардал:
- Phase 1: $8,400
- Phase 2: $6,800
- Phase 3: $4,800
- **Нийт**: **$20,000** (ойролцоогоор)

**Анхаар**: Энэ нь Монголын зах зээлийн үнэ. Олон улсын баг эсвэл freelance developer-ууд өөр үнэтэй байж болно.

## 2. Hosting ба Infrastructure Зардал

### 2.1 Cloud Hosting

#### DigitalOcean (Зөвлөмж - Анхны хувилбар):

**Droplet (Application Server)**:
- **Basic**: $12/сар (1 vCPU, 1GB RAM, 25GB SSD)
- **Recommended**: $24/сар (2 vCPU, 2GB RAM, 50GB SSD)
- **Production**: $48/сар (4 vCPU, 4GB RAM, 80GB SSD)

**Managed PostgreSQL**:
- **Basic**: $15/сар (1GB RAM, 10GB storage)
- **Recommended**: $30/сар (2GB RAM, 25GB storage)

**Managed Redis**:
- **Basic**: $15/сар (1GB RAM)
- **Recommended**: $30/сар (2GB RAM)

**Spaces (Object Storage)**:
- **Storage**: $5/сар (250GB)
- **Bandwidth**: $0.01/GB (эхний 1TB үнэгүй)

**Нийт (Recommended)**: 
- Application: $24/сар
- Database: $30/сар
- Redis: $30/сар
- Storage: $5/сар
- **Нийт**: **$89/сар** ≈ **$1,068/жил**

#### AWS (Scalable, илүү үнэтэй):

**EC2 (Application Server)**:
- **t3.small**: ~$15/сар (2 vCPU, 2GB RAM)
- **t3.medium**: ~$30/сар (2 vCPU, 4GB RAM)

**RDS PostgreSQL**:
- **db.t3.micro**: ~$15/сар (1 vCPU, 1GB RAM, 20GB storage)
- **db.t3.small**: ~$30/сар (2 vCPU, 2GB RAM, 20GB storage)

**ElastiCache Redis**:
- **cache.t3.micro**: ~$15/сар (0.5GB RAM)

**S3 Storage**:
- **Storage**: $0.023/GB/сар
- **Transfer Out**: $0.09/GB (эхний 100GB үнэгүй)

**CloudFront CDN**:
- **Data Transfer**: $0.085/GB (эхний 10TB)

**Нийт (Basic)**: ~$60-100/сар (ачаалалаас хамаарна)

### 2.2 Domain & SSL

#### Domain Name:
- **.mn domain**: ~$30-50/жил
- **.com domain**: ~$10-15/жил

#### SSL Certificate:
- **Let's Encrypt**: Үнэгүй
- **Commercial SSL**: ~$50-200/жил

**Нийт**: **$40-65/жил**

## 3. Third-Party Services Зардал

### 3.1 Video Streaming

#### Cloudflare Stream (Зөвлөмж - Анхны хувилбар):
- **Storage**: $5/1000 minutes/сар
- **Delivery**: $1/1000 minutes
- **Encoding**: Included

**Тооцоолол** (100 хэрэглэгч, сард 10GB video):
- Storage: ~$50/сар (10,000 minutes)
- Delivery: ~$10/сар (1,000 minutes watched)
- **Нийт**: **~$60/сар**

#### AWS S3 + CloudFront (Масштаблахад):
- **S3 Storage**: $0.023/GB/сар = $0.23/сар (10GB)
- **CloudFront**: $0.085/GB = $0.85/сар (10GB)
- **Нийт**: **~$1/сар** (бага хэмжээтэй)
- **Том хэмжээтэй**: ~$50-200/сар (100GB+)

### 3.2 Payment Processing

#### Stripe:
- **Transaction Fee**: 2.9% + $0.30 per transaction
- **No monthly fee**

**Тооцоолол** (100 хэрэглэгч, сард $5,000 төлбөр):
- Transaction fees: $5,000 × 2.9% + (100 × $0.30) = $145 + $30 = **$175/сар**

#### PayPal:
- **Transaction Fee**: 2.9% + fixed fee (country-dependent)
- **No monthly fee**

**Тооцоолол**: Ойролцоогоор Stripe-тэй ижил

#### Монгол Банкны API:
- **Integration Fee**: Шалгах шаардлагатай
- **Transaction Fee**: Банкаас асуух

### 3.3 Email Service

#### SendGrid:
- **Free Tier**: 100 emails/өдөр
- **Essentials**: $15/сар (40,000 emails)
- **Pro**: $90/сар (100,000 emails)

#### AWS SES:
- **$0.10 per 1,000 emails**
- **Нийт**: ~$5-10/сар (бага хэмжээтэй)

**Зөвлөмж**: SendGrid Essentials - **$15/сар**

### 3.4 Monitoring & Analytics

#### Sentry (Error Tracking):
- **Developer**: $26/сар (50K events)
- **Team**: $80/сар (200K events)

#### UptimeRobot (Uptime Monitoring):
- **Free**: 50 monitors
- **Pro**: $7/сар (50 monitors)

#### Google Analytics:
- **Free**: Unlimited

**Зөвлөмж**: 
- Sentry Developer: **$26/сар**
- UptimeRobot Free: **$0/сар**
- Google Analytics: **$0/сар**

### 3.5 CDN

#### Cloudflare:
- **Free Tier**: Basic CDN, DDoS protection
- **Pro**: $20/сар (Advanced features)

**Зөвлөмж**: Cloudflare Free - **$0/сар** (анхны хувилбар)

## 4. Нийт Зардлын Тооцоо

### 4.1 Анхны Хувилбар (MVP - Phase 1)

#### Хөгжүүлэлт:
- **$8,400** (4 сар)

#### Hosting (Сар бүр):
- DigitalOcean: **$89/сар**
- Domain & SSL: **$5/сар** (жилийн зардлыг хуваасан)

#### Third-Party Services (Сар бүр):
- Cloudflare Stream: **$60/сар**
- SendGrid: **$15/сар**
- Sentry: **$26/сар**
- Cloudflare CDN: **$0/сар**

#### Нийт (Сар бүр):
- **$195/сар** (hosting + services)
- **$2,340/жил**

#### Нийт (Анхны хувилбар):
- Хөгжүүлэлт: $8,400
- Жилийн hosting + services: $2,340
- **Нийт**: **$10,740** (эхний жил)

### 4.2 Бүрэн Хувилбар (Phase 1-3)

#### Хөгжүүлэлт:
- Phase 1: $8,400
- Phase 2: $6,800
- Phase 3: $4,800
- **Нийт**: **$20,000**

#### Hosting (Сар бүр - Production):
- DigitalOcean (scaled): **$150/сар**
- Domain & SSL: **$5/сар**

#### Third-Party Services (Сар бүр):
- Cloudflare Stream: **$100/сар** (илүү video)
- Stripe fees: **$175/сар** (төлбөрийн хэмжээнээс хамаарна)
- SendGrid: **$15/сар**
- Sentry: **$26/сар**
- Cloudflare CDN: **$0/сар**

#### Нийт (Сар бүр):
- **$471/сар** (hosting + services)
- **$5,652/жил**

#### Нийт (Бүрэн хувилбар):
- Хөгжүүлэлт: $20,000
- Жилийн hosting + services: $5,652
- **Нийт**: **$25,652** (эхний жил)

### 4.3 Масштаблахад (1000+ хэрэглэгч)

#### Hosting (Сар бүр):
- DigitalOcean/AWS (scaled): **$300-500/сар**
- Database (scaled): **$100-200/сар**

#### Third-Party Services (Сар бүр):
- Video streaming: **$200-500/сар**
- Payment fees: **$500-2000/сар** (төлбөрийн хэмжээнээс хамаарна)
- Email: **$50/сар**
- Monitoring: **$100/сар**

#### Нийт (Сар бүр):
- **$1,250-3,250/сар**
- **$15,000-39,000/жил**

## 5. Зардлыг Хэмнэх Арга

### 5.1 Анхны Хувилбарт:

1. **Free Tier Services**:
   - Cloudflare CDN (Free)
   - Google Analytics (Free)
   - UptimeRobot (Free)
   - Let's Encrypt SSL (Free)

2. **Хямд Hosting**:
   - DigitalOcean (LAMP stack-тэй харьцуулахад хямд)
   - VPS (хэрэв багт DevOps мэдлэг байгаа бол)

3. **Optimize Video**:
   - Video compression
   - Adaptive bitrate
   - Lazy loading

4. **Caching**:
   - Redis caching
   - CDN caching
   - Database query optimization

### 5.2 Масштаблахад:

1. **Auto-scaling**:
   - Load balancer
   - Auto-scaling groups
   - Database read replicas

2. **Cost Monitoring**:
   - AWS Cost Explorer
   - DigitalOcean billing alerts
   - Regular cost reviews

## 6. Зардлын Хуваарь

### 6.1 Анхны Хувилбар (MVP)

| Зардал | Хэмжээ | Тайлбар |
|--------|--------|---------|
| Хөгжүүлэлт | $8,400 | 4 сар |
| Hosting (сар) | $89 | DigitalOcean |
| Video Streaming (сар) | $60 | Cloudflare Stream |
| Email (сар) | $15 | SendGrid |
| Monitoring (сар) | $26 | Sentry |
| Domain & SSL (жил) | $50 | .mn domain |
| **Нийт (эхний жил)** | **$10,740** | |

### 6.2 Бүрэн Хувилбар

| Зардал | Хэмжээ | Тайлбар |
|--------|--------|---------|
| Хөгжүүлэлт | $20,000 | Phase 1-3 |
| Hosting (сар) | $150 | Scaled |
| Video Streaming (сар) | $100 | More video |
| Payment Fees (сар) | $175 | Stripe (variable) |
| Email (сар) | $15 | SendGrid |
| Monitoring (сар) | $26 | Sentry |
| Domain & SSL (жил) | $50 | .mn domain |
| **Нийт (эхний жил)** | **$25,652** | |

## 7. Дүгнэлт

### Гол Зардал:

1. **Хөгжүүлэлт**: $8,400 - $20,000 (phase-аас хамаарна)
2. **Hosting**: $89 - $500/сар (масштабаас хамаарна)
3. **Third-Party Services**: $100 - $500/сар (хэрэглээнээс хамаарна)

### Зөвлөмж:

1. **Анхны хувилбарт**:
   - DigitalOcean hosting ($89/сар)
   - Cloudflare Stream ($60/сар)
   - Free tier services ашиглах
   - **Нийт**: ~$200/сар

2. **Масштаблахад**:
   - Auto-scaling
   - Cost monitoring
   - Regular optimization

3. **Төсөв төлөвлөлт**:
   - Хөгжүүлэлт: $20,000 (эхний жил)
   - Hosting + Services: $5,652/жил
   - **Нийт**: ~$25,652 (эхний жил)

### Анхаар:

- Эдгээр тооцоо нь **ойролцоогоор** байна
- Бодит зардал нь хэрэглээ, масштаб, багийн ур чадвараас хамаарна
- Payment fees нь төлбөрийн хэмжээнээс хамаарна (variable)
- Video streaming зардал нь video хэмжээнээс хамаарна








