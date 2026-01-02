const express = require('express');
const router = express.Router();
const { body, query: queryValidator, validationResult } = require('express-validator');
const paymentService = require('../services/paymentService');
const { authenticate, authorize } = require('../middleware/auth');

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
 * POST /api/payments
 * Create payment
 */
router.post(
  '/',
  authenticate,
  [
    body('courseId').isUUID().withMessage('Valid course ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('paymentMethod').isIn(['stripe', 'qpay', 'bank_transfer']).withMessage('Invalid payment method'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const payment = await paymentService.createPayment(
        req.body,
        req.user.userId
      );
      res.status(201).json({ payment });
    } catch (error) {
      if (error.message === 'Course not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('already enrolled') || error.message.includes('amount does not match')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/payments/:id
 * Get payment status
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(
      req.params.id,
      req.user.userId
    );
    res.json({ payment });
  } catch (error) {
    if (error.message === 'Payment not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Access denied') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/payments/:id/webhook
 * Payment webhook (for payment gateways)
 */
router.post(
  '/:id/webhook',
  [
    body('transactionId').notEmpty(),
    body('status').isIn(['pending', 'completed', 'failed', 'refunded']),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      // In production, verify webhook signature here
      // const isValid = await paymentService.verifyWebhookSignature(...);
      // if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

      const payment = await paymentService.updatePaymentStatus(
        req.body.transactionId,
        req.body.status,
        req.params.id
      );

      res.json({ payment });
    } catch (error) {
      if (error.message === 'Payment not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/payments/history
 * Get payment history
 */
router.get(
  '/history',
  authenticate,
  [
    queryValidator('page').optional().isInt({ min: 1 }),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
    queryValidator('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const filters = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        status: req.query.status
      };

      const result = await paymentService.getPaymentHistory(
        req.user.userId,
        filters
      );
      res.json(result);
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

