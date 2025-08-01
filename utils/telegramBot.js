const axios = require('axios');
const config = require('../config/config');

const sendMessage = async (message) => {
  if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot token or chat ID not configured');
    return;
  }

  const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: config.TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
    throw error;
  }
};

module.exports = {
  sendMessage,
};