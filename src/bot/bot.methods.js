const { BotCore } = require("./bot.core");
const { message } = require("telegraf/filters");
const { fetch } = require("@src/api");
const { StartButtons } = require("@src/buttons");

class BotMethods extends BotCore {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      await ctx.reply("Welcome to DefineIt!");
      const menuMsg = await ctx.reply("Menu", StartButtons);
      this.messages.push(menuMsg.message_id);
    });
  }

  async wordHandlerMethod() {
    this.bot.on(message("text"), async (ctx) => {
      switch (this.mode) {
        case "play":
          console.log("play");
          break;
        case "addNewWord":
          console.log("addNewWord");
          break;
        case "translate":
          await ctx.deleteMessage();
          this.clearTextMessages(ctx);
          const word = ctx.update.message.text;
          const waitingMsg = await ctx.reply(`Translating - ${word}`);
          const definition = await fetch.fetchDefinition(word);
          ctx.deleteMessage(waitingMsg.message_id);
          const definitionMsg = await ctx.reply(definition);
          this.textMessages.push(definitionMsg.message_id);
          return;
        default:
          ctx.deleteMessage();
      }
    });
  }

  clearMessages(ctx) {
    this.messages.forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (e) {
        console.error("Error");
      }
    });
    this.messages = [];
  }

  clearTextMessages(ctx) {
    this.textMessages.forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (e) {
        console.error("Error");
      }
    });
    this.textMessages = [];
  }
}

module.exports = { BotMethods };
