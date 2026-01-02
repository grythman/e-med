const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const userRepository = require('../repositories/userRepository');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || null
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString()
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (include passwordHash for verification)
    const User = require('../models/User');
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString()
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/auth/me
 * Update current user profile
 */
router.put(
  '/me',
  authenticate,
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 100 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('avatarUrl').optional().isURL(),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const updatedUser = await userRepository.update(req.user.userId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        avatarUrl: req.body.avatarUrl
      });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          role: updatedUser.role,
          avatarUrl: updatedUser.avatarUrl
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if user still exists and is active
      const user = await userRepository.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!user.is_active) {
        return res.status(401).json({ error: 'User account is inactive' });
      }

      // Generate new tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id
      });

      res.json({
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }
);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await userRepository.findByEmail(email);

      // Don't reveal if user exists (security best practice)
      if (!user) {
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

      // Store token
      await userRepository.createPasswordResetToken(email, resetToken, expiresAt);

      // In production, send email with reset link
      // For now, we'll just return success (in dev, you might want to log the token)
      if (process.env.NODE_ENV === 'development') {
        console.log('Password reset token:', resetToken);
        console.log('Reset link:', `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);
      }

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
      .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number and special character'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { token, password } = req.body;

      // Get reset token
      const resetTokenData = await userRepository.getPasswordResetToken(token);

      if (!resetTokenData) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Find user
      const user = await userRepository.findByEmail(resetTokenData.email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Hash new password
      const passwordHash = await hashPassword(password);

      // Update password
      await userRepository.update(user._id.toString(), { passwordHash });

      // Delete reset token
      await userRepository.deletePasswordResetToken(token);

      res.json({
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user (client should delete tokens)
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can add token blacklisting here if needed (using Redis)
    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;








