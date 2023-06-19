require("module-alias/register");
const { TELEGRAM_TOKEN, Bot, restapi } = require("@src");
const mongoose = require("mongoose");

const bot = new Bot(TELEGRAM_TOKEN);

void (async function () {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    autoCreate: false,
  });
  restapi.start();
  bot.start();
})();
