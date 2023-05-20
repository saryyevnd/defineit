require("module-alias/register");
const {
  TELEGRAM_TOKEN,
  Bot,
  restapi,
  MONGODB_PASSWORD,
  MONGODB_LOGIN,
} = require("@src");
const mongoose = require("mongoose");

const mongoDbUrl = `mongodb+srv://${MONGODB_LOGIN}:${MONGODB_PASSWORD}@cluster0.dica1nv.mongodb.net/?retryWrites=true&w=majority`;
const bot = new Bot(TELEGRAM_TOKEN);

void (async function () {
  await mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  restapi.start();
  bot.start();
})();
