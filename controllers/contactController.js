const ErrorResponse = require('../utils/errorResponse');

// @desc    Contact form submission
// @route   POST /api/v1/contact
// @access  Public
exports.contactUs = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Or forward to another service

    // For now, just log and return success
    console.log('New contact form submission:', { name, email, subject, message });

    res.status(200).json({
      success: true,
      data: 'Message received. We will contact you soon.'
    });

  } catch (err) {
    next(err);
  }
};