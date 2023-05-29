const { BotCore } = require("./bot.core");
const { message } = require("telegraf/filters");
const { fetch } = require("@src/api");
const { StartButtons } = require("@src/buttons");

class BotMethods extends BotCore {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      ctx.deleteMessage();
      this.clearMessagesForStart(ctx);
      this.chatMessagesId.forChangeMode = [];
      this.chatMessagesId.translatedWords = [];
      this.mode = "";

      const welcomeMsg = await ctx.reply("Welcome to DefineIt!");
      const menuMsg = await ctx.reply("Menu", StartButtons);

      this.chatMessagesId.forChangeMode.push(menuMsg.message_id);

      this.chatMessagesId.all.push(welcomeMsg.message_id);
      this.chatMessagesId.all.push(menuMsg.message_id);
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
        case "chatgpt":
          console.log("chatgpt");
          break;
        case "translate":
          await ctx.deleteMessage();
          this.clearTranslatedWord(ctx);
          const word = ctx.update.message.text;
          const waitingMsg = await ctx.reply(`Translating - ${word}`);
          const definition = await fetch.fetchDefinition(word);
          ctx.deleteMessage(waitingMsg.message_id);
          const definitionMsg = await ctx.reply(definition);
          this.chatMessagesId.translatedWords.push(definitionMsg.message_id);
          this.chatMessagesId.all.push(definitionMsg.message_id);
          return;
        default:
          ctx.deleteMessage();
      }
    });

    this.bot.on(message("sticker"), (ctx) => {
      ctx.deleteMessage();
    });
  }

  clearMessagesForStart(ctx) {
    this.chatMessagesId.all.forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch {
        console.log("Error");
      }
    });
    this.chatMessagesId.all = [];
  }

  clearMessagesForChangeMode(ctx) {
    this.chatMessagesId.forChangeMode.forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (e) {
        console.error("Error");
      }
    });
    this.chatMessagesId.forChangeMode = [];
  }

  clearTranslatedWord(ctx) {
    this.chatMessagesId.translatedWords.forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (e) {
        console.error("Error");
      }
    });
    this.chatMessagesId.translatedWords = [];
  }
}

module.exports = { BotMethods };
