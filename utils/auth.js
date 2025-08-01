const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate token
const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// Create and send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = getSignedJwtToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
};

module.exports = {
  getSignedJwtToken,
  sendTokenResponse,
};