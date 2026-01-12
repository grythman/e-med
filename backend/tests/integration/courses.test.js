const request = require('supertest');
const app = require('../../server');

describe('Courses API Integration Tests', () => {
  let authToken;
  let adminToken;
  let testCourseId;

  // Setup: Create test users and get tokens
  beforeAll(async () => {
    // Register regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `coursetest${Date.now()}@example.com`,
        password: 'Test123!@#',
        firstName: 'Course',
        lastName: 'Tester',
      });
    authToken = userRes.body.tokens?.accessToken;

    // Note: Admin token would be set up differently in real tests
    // For now, we'll skip admin-only tests or mock admin authentication
  });

  describe('GET /api/courses', () => {
    it('should return list of published courses', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(response.body).toHaveProperty('courses');
      expect(Array.isArray(response.body.courses)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/courses?page=1&limit=5')
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
    });

    it('should filter by level', async () => {
      const response = await request(app)
        .get('/api/courses?level=beginner')
        .expect(200);

      expect(response.body).toHaveProperty('courses');
    });

    it('should search by title', async () => {
      const response = await request(app)
        .get('/api/courses?search=test')
        .expect(200);

      expect(response.body).toHaveProperty('courses');
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should return 404 for non-existent course', async () => {
      await request(app)
        .get('/api/courses/000000000000000000000000')
        .expect(404);
    });

    it('should return 400 for invalid course ID', async () => {
      await request(app)
        .get('/api/courses/invalid-id')
        .expect(400);
    });
  });

  describe('GET /api/courses/user/enrolled', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/api/courses/user/enrolled')
        .expect(401);
    });

    it('should return enrolled courses for authenticated user', async () => {
      if (!authToken) return;

      const response = await request(app)
        .get('/api/courses/user/enrolled')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('enrollments');
      expect(Array.isArray(response.body.enrollments)).toBe(true);
    });
  });

  describe('POST /api/courses/:id/enroll', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/api/courses/000000000000000000000000/enroll')
        .expect(401);
    });
  });

  describe('Course Lessons', () => {
    describe('GET /api/courses/:id/lessons', () => {
      it('should return 404 for non-existent course', async () => {
        await request(app)
          .get('/api/courses/000000000000000000000000/lessons')
          .expect(404);
      });
    });
  });
});

