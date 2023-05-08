const { Telegraf } = require("telegraf");
const { fetchWordDefinition } = require("@src/api");
const { message } = require("telegraf/filters");

class Bot {
  #token = "";
  constructor(token = "") {
    if (Bot.hasToken) {
      return Bot.instance;
    }

    Bot.instance = this;
    Bot.hasToken = true;
    this.#token = token;
  }

  start() {
    const bot = new Telegraf(this.#token);
    bot.start(this.bot_start_reply);
    bot.on(message("text"), this.bot_word_handler);
    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }

  bot_start_reply(ctx) {
    ctx.reply("Welcome to DefineIt, I'm happy to help you!");
  }

  async bot_word_handler(ctx) {
    const text = ctx.update.message.text.toUpperCase();
    ctx.reply(`Definition of ${text}`);
    const response = await fetchWordDefinition(text);
    const definition = response["content"];
    ctx.reply(definition);
  }
}

module.exports = { Bot };
