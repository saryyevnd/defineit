const dotenv = require("dotenv");
dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_TOKEN = process.env.OPENAI_TOKEN;

module.exports = {
  TELEGRAM_TOKEN,
  OPENAI_TOKEN,
};
