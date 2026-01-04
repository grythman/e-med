const crypto = require('crypto');
require('dotenv').config();

/**
 * Video Service
 * Handles video URL generation and CDN integration
 */
class VideoService {
  constructor() {
    this.cdnProvider = process.env.VIDEO_CDN_PROVIDER || 'cloudflare';
    this.cdnUrl = process.env.VIDEO_CDN_URL;
    this.cdnSecret = process.env.VIDEO_CDN_SECRET;
  }

  /**
   * Generate signed URL for video access
   */
  generateSignedUrl(videoId, userId, expiresIn = 3600) {
    if (!this.cdnUrl || !this.cdnSecret) {
      // Development: return original URL
      return {
        videoUrl: videoId,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      };
    }

    const expires = Math.floor(Date.now() / 1000) + expiresIn;
    const path = `/videos/${videoId}`;
    
    // Generate signature
    const signature = this.generateSignature(path, expires, userId);
    
    // Build signed URL
    const signedUrl = `${this.cdnUrl}${path}?expires=${expires}&signature=${signature}&user=${userId}`;

    return {
      videoUrl: signedUrl,
      expiresAt: new Date(expires * 1000),
    };
  }

  /**
   * Generate signature for URL
   */
  generateSignature(path, expires, userId) {
    const message = `${path}${expires}${userId}`;
    return crypto
      .createHmac('sha256', this.cdnSecret)
      .update(message)
      .digest('hex');
  }

  /**
   * Verify signed URL
   */
  verifySignedUrl(url, userId) {
    try {
      const urlObj = new URL(url);
      const expires = parseInt(urlObj.searchParams.get('expires'));
      const signature = urlObj.searchParams.get('signature');
      const path = urlObj.pathname;

      // Check expiration
      if (expires < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'URL expired' };
      }

      // Verify signature
      const expectedSignature = this.generateSignature(path, expires, userId);
      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Get video URL for lesson (with access control)
   */
  async getVideoUrl(lessonId, userId, courseId) {
    // In production, get video ID from lesson
    // For now, assume lesson.videoUrl contains the video ID or URL
    
    // Check if user has access (enrolled or preview)
    // This should be checked in the service layer
    
    // Generate signed URL
    const videoId = lessonId; // In production, get from lesson document
    return this.generateSignedUrl(videoId, userId);
  }

  /**
   * Upload video to CDN (placeholder)
   */
  async uploadVideo(file, courseId, lessonId) {
    // In production, implement actual upload to Cloudflare Stream or AWS S3
    // For now, return placeholder
    return {
      videoId: `video_${Date.now()}`,
      videoUrl: `https://cdn.example.com/videos/video_${Date.now()}`,
      thumbnailUrl: null,
    };
  }
}

module.exports = new VideoService();

