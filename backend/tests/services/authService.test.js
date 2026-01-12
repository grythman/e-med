const authService = require('../../services/authService');
const userRepository = require('../../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        _id: 'user123',
        ...validUserData,
        password: hashedPassword,
        role: 'student',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mockToken');

      const result = await authService.register(validUserData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(userRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
    });

    it('should throw error if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({ email: validUserData.email });

      await expect(authService.register(validUserData)).rejects.toThrow(
        'Email already registered'
      );
    });

    it('should throw error if password is too weak', async () => {
      const weakPasswordData = { ...validUserData, password: '123' };
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.register(weakPasswordData)).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });

    it('should throw error if email is invalid', async () => {
      const invalidEmailData = { ...validUserData, email: 'invalid-email' };
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.register(invalidEmailData)).rejects.toThrow(
        'Invalid email format'
      );
    });
  });

  describe('login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        _id: 'user123',
        email: credentials.email,
        password: 'hashedPassword',
        role: 'student',
        isActive: true,
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      const result = await authService.login(credentials.email, credentials.password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
    });

    it('should throw error for non-existent user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login(credentials.email, credentials.password)
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        _id: 'user123',
        email: credentials.email,
        password: 'hashedPassword',
        isActive: true,
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login(credentials.email, credentials.password)
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for inactive user', async () => {
      const mockUser = {
        _id: 'user123',
        email: credentials.email,
        password: 'hashedPassword',
        isActive: false,
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await expect(
        authService.login(credentials.email, credentials.password)
      ).rejects.toThrow('Account is deactivated');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const mockDecoded = { userId: 'user123', role: 'student' };
      jwt.verify.mockReturnValue(mockDecoded);

      const result = await authService.verifyToken('validToken');

      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toEqual(mockDecoded);
    });

    it('should throw error for invalid token', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken('invalidToken')).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const mockDecoded = { userId: 'user123' };
      const mockUser = { _id: 'user123', isActive: true };

      jwt.verify.mockReturnValue(mockDecoded);
      userRepository.findById.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('newToken');

      const result = await authService.refreshToken('validRefreshToken');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for invalid refresh token', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalidToken')).rejects.toThrow();
    });
  });
});

