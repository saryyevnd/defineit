const dotenv = require("dotenv");
dotenv.config();

const { TELEGRAM_TOKEN, MONGODB_PASSWORD, MONGODB_LOGIN, OPENAI_TOKEN } =
  process.env;

module.exports = {
  TELEGRAM_TOKEN,
  OPENAI_TOKEN,
  MONGODB_LOGIN,
  MONGODB_PASSWORD,
};
