const { Telegraf } = require("telegraf");

class BotCore {
  constructor(token = "") {
    // Singleton
    if (BotCore.hasToken) {
      return BotCore.instance;
    }

    BotCore.instance = this;
    BotCore.hasToken = true;
    this.token = token;
    this.bot = new Telegraf(this.token);
    this.isListening = true;
    this.messages = [];
  }
}

module.exports = { BotCore };
