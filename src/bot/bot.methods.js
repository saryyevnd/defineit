const { BotCore } = require("./bot.core");
const { chatgpt } = require("@src/chatgpt");
const { Markup } = require("telegraf");
const { message } = require("telegraf/filters");

const Buttons = Markup.inlineKeyboard([
  Markup.button.callback("Train!", "training"),
  Markup.button.callback("Enter a new word!", "enterNewWord"),
]);

class BotMethods extends BotCore {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      await ctx.reply("Welcome to DefineIt, I'm happy to help you!");
      await ctx.reply("Choose what you want!", Buttons);
    });
  }

  async wordHandlerMethod() {
    this.bot.on(message("text"), async (ctx) => {
      this.messages.push(ctx.update.message.message_id);
      ctx.deleteMessage();
      if (!this.isListening) return;
      const text = ctx.update.message.text;
      const replyText = `Definition of ${text}`;
      const { message_id: message_id1 } = await ctx.reply(replyText);
      this.messages.push(message_id1);
      const response = await chatgpt.fetchWordDefinitions(text);
      const choices = response.choices || [];
      const definition = choices.reduce((acc, choice) => {
        const { message } = choice;
        return acc + "\n" + message["content"];
      }, "");
      const { message_id: message_id2 } = await ctx.reply(definition);
      this.messages.push(message_id2);
    });
  }
}

module.exports = { BotMethods };
