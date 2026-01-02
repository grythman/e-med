const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');

/**
 * User Repository
 * Data access layer for users
 */
class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    return await User.findById(id).select('-passwordHash');
  }

  /**
   * Create user
   */
  async create(userData) {
    const user = new User({
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role || 'student'
    });
    return await user.save();
  }

  /**
   * Update user
   */
  async update(id, userData) {
    const updateData = {};
    
    if (userData.firstName !== undefined) updateData.firstName = userData.firstName;
    if (userData.lastName !== undefined) updateData.lastName = userData.lastName;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.avatarUrl !== undefined) updateData.avatarUrl = userData.avatarUrl;
    if (userData.passwordHash !== undefined) updateData.passwordHash = userData.passwordHash;

    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, select: '-passwordHash' }
    );
  }

  /**
   * Create password reset token
   */
  async createPasswordResetToken(email, token, expiresAt) {
    return await PasswordResetToken.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        email: email.toLowerCase().trim(),
        token,
        expiresAt
      },
      { upsert: true, new: true }
    );
  }

  /**
   * Get password reset token
   */
  async getPasswordResetToken(token) {
    return await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() }
    });
  }

  /**
   * Delete password reset token
   */
  async deletePasswordResetToken(token) {
    return await PasswordResetToken.deleteOne({ token });
  }
}

module.exports = new UserRepository();
