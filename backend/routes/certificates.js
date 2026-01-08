const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const certificateService = require('../services/certificateService');
const { authenticate } = require('../middleware/auth');

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
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

/**
 * GET /api/certificates
 * List user certificates
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const certificates = await certificateService.getUserCertificates(
      req.user.userId
    );
    res.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/certificates/verify/:code
 * Verify certificate (public endpoint) - Must be before /:id
 */
router.get(
  '/verify/:code',
  [param('code').notEmpty(), handleValidationErrors],
  async (req, res) => {
    try {
      const certificate = await certificateService.verifyCertificate(
        req.params.code
      );
      res.json({ certificate, isValid: true });
    } catch (error) {
      if (error.message === 'Certificate not found') {
        return res.status(404).json({ error: error.message, isValid: false });
      }
      console.error('Verify certificate error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/certificates/:id
 * Get certificate
 */
router.get(
  '/:id',
  authenticate,
  [param('id').custom(isValidObjectId).withMessage('Invalid certificate ID'), handleValidationErrors],
  async (req, res) => {
    try {
      const certificate = await certificateService.getCertificateById(
        req.params.id,
        req.user.userId
      );
      res.json({ certificate });
    } catch (error) {
      if (error.message === 'Certificate not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: error.message });
      }
      console.error('Get certificate error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/certificates/:id/download
 * Download certificate PDF
 */
router.post(
  '/:id/download',
  authenticate,
  [param('id').custom(isValidObjectId).withMessage('Invalid certificate ID'), handleValidationErrors],
  async (req, res) => {
    try {
      const result = await certificateService.downloadCertificate(
        req.params.id,
        req.user.userId
      );
      res.json(result);
    } catch (error) {
      if (error.message === 'Certificate not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: error.message });
      }
      console.error('Download certificate error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/certificates/generate/:enrollmentId
 * Generate certificate for completed course
 */
router.post(
  '/generate/:enrollmentId',
  authenticate,
  [param('enrollmentId').custom(isValidObjectId).withMessage('Invalid enrollment ID'), handleValidationErrors],
  async (req, res) => {
    try {
      const certificate = await certificateService.generateCertificate(
        req.params.enrollmentId,
        req.user.userId
      );
      res.status(201).json({ certificate });
    } catch (error) {
      if (error.message === 'Enrollment not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('must be completed')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Generate certificate error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;


