# Testing Guide

Энэхүү баримт бичигт e-med төслийн тестийн зааварчилгаа багтсан.

## Backend Tests

### Тест ажиллуулах

```bash
cd backend
npm test
```

### Coverage харах

```bash
npm test -- --coverage
```

### Тест файлууд

- **Unit Tests**: `tests/services/` - Service layer тестүүд
  - `authService.test.js` - Authentication service
  - `courseService.test.js` - Course service
  - `paymentService.test.js` - Payment service
  - `enrollmentService.test.js` - Enrollment service
  - `certificateService.test.js` - Certificate service

- **Integration Tests**: `tests/integration/` - API endpoint тестүүд
  - `auth.test.js` - Auth API endpoints
  - `courses.test.js` - Courses API endpoints

### Тест environment

Тестүүд `.env.test` файл ашигладаг. MongoDB болон Redis mock хийгдсэн.

## Frontend Tests

### Тест ажиллуулах

```bash
cd frontend
npm test
```

### Watch mode

```bash
npm test -- --watch
```

### Coverage

```bash
npm run test:coverage
```

### UI mode

```bash
npm run test:ui
```

### Тест файлууд

- **Component Tests**: `src/tests/components/`
  - `Button.test.jsx` - Button component тестүүд
  - `Input.test.jsx` - Input component тестүүд

- **Page Tests**: `src/tests/pages/`
  - `Home.test.jsx` - Home page тестүүд

## Performance Optimization

### Lazy Loading

Бүх page компонентүүд lazy loading ашигладаг (Home-ээс бусад):

```javascript
const Courses = lazy(() => import('./pages/Courses'));
```

### Memoization

CourseCard компонент React.memo ашиглаж байна:

```javascript
export default memo(CourseCard);
```

## SEO

### React Helmet

SEO компонент ашиглан meta tags нэмэгдсэн:

```javascript
<SEO
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
/>
```

## Accessibility

### ARIA Attributes

- Button компонент: `aria-disabled`, `aria-busy`
- Input компонент: `aria-invalid`, `aria-describedby`
- Error messages: `role="alert"`

### Keyboard Navigation

Бүх интерактив элементүүд keyboard navigation дэмждэг.

## Test Coverage Goals

- Backend Services: >80%
- Frontend Components: >70%
- API Endpoints: >75%

## Continuous Integration

CI/CD pipeline дээр дараах тестүүд автоматаар ажиллана:

1. Backend unit tests
2. Backend integration tests
3. Frontend component tests
4. Linting checks

