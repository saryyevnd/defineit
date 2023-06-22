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

    this.chatMessagesId = {
      all: [],
      changeMode: [],
      play: [],
      translate: [],
      chatgpt: [],
      addNewWord: [],
    };
    this.mode = "";
    this.modes = ["play", "translate", "chatgpt", "addNewWord", "changeMode"];

    this.currentWord = { showTime: null, word: null };
    this.timeIncrements = {
      "1day": 24 * 60 * 60 * 1000,
      "6hours": 6 * 60 * 60 * 1000,
      "1hour": 60 * 60 * 1000,
    };
  }

  async reply(ctx = {}, ...rest) {
    const message = await ctx.reply(...rest);
    this.chatMessagesId.all.push(message.message_id);
    return message;
  }
}

module.exports = { BotCore };
