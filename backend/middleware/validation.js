const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors for better frontend display
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg || err.message
    }));
    
    // If single error, return simple error message for backward compatibility
    if (formattedErrors.length === 1) {
      return res.status(400).json({ 
        error: formattedErrors[0].message,
        errors: formattedErrors 
      });
    }
    
    // Multiple errors
    const errorMessages = formattedErrors.map(e => e.message).join(', ');
    return res.status(400).json({ 
      error: errorMessages,
      errors: formattedErrors 
    });
  }
  next();
};

/**
 * User registration validation rules
 */
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number and special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('First name must be between 2 and 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Last name must be between 2 and 100 characters'),
  handleValidationErrors
];

/**
 * Login validation rules
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};








