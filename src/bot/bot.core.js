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
  }

  async reply(ctx = {}, ...rest) {
    const message = await ctx.reply(...rest);
    this.chatMessagesId.all.push(message.message_id);
    return message;
  }
}

module.exports = { BotCore };
