const stripe = require('stripe');
require('dotenv').config();

/**
 * Payment Gateway Service
 * Handles payment processing (Stripe, QPay, etc.)
 */
class PaymentGatewayService {
  constructor() {
    // Stripe configuration
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
    }

    // QPay configuration
    this.qpayUrl = process.env.QPAY_URL || 'https://api.qpay.mn';
    this.qpayUsername = process.env.QPAY_USERNAME;
    this.qpayPassword = process.env.QPAY_PASSWORD;
  }

  /**
   * Create payment intent (Stripe)
   */
  async createStripePayment(amount, currency, metadata = {}) {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create QPay invoice
   */
  async createQPayInvoice(amount, currency, description, invoiceCode) {
    if (!this.qpayUsername || !this.qpayPassword) {
      throw new Error('QPay not configured');
    }

    try {
      // Get access token
      const tokenResponse = await fetch(`${this.qpayUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.qpayUsername,
          password: this.qpayPassword,
        }),
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Create invoice
      const invoiceResponse = await fetch(`${this.qpayUrl}/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_code: invoiceCode,
          sender_invoice_no: `EMED-${Date.now()}`,
          invoice_receiver_code: 'terminal',
          invoice_description: description,
          amount: amount,
          callback_url: `${process.env.API_URL || 'http://localhost:5000'}/api/payments/webhook`,
        }),
      });

      const invoiceData = await invoiceResponse.json();

      return {
        success: true,
        invoiceId: invoiceData.invoice_id,
        qrCode: invoiceData.qr_text,
        qrImage: invoiceData.qr_image,
      };
    } catch (error) {
      console.error('QPay invoice error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify webhook signature (Stripe)
   */
  async verifyStripeWebhook(payload, signature) {
    if (!this.stripe) {
      return { valid: false, error: 'Stripe not configured' };
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return { valid: true, event };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Process payment based on method
   */
  async processPayment(paymentMethod, amount, currency, metadata) {
    switch (paymentMethod) {
      case 'stripe':
        return await this.createStripePayment(amount, currency, metadata);
      case 'qpay':
        return await this.createQPayInvoice(
          amount,
          currency,
          metadata.description || 'Course payment',
          metadata.invoiceCode || `EMED-${Date.now()}`
        );
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }
}

module.exports = new PaymentGatewayService();

