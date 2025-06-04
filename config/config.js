module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'kJOikjOIKJKJLlkjlkjOIU098387987uyIUYUIoiuyjhjyukjoiuqery',
  JWT_EXPIRE: '30d',
  COOKIE_EXPIRE: 30,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};