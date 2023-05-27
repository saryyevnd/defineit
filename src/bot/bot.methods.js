const { BotCore } = require("./bot.core");
const { message } = require("telegraf/filters");
const { USERS_WORDS } = require("@src/mock");
const { chatgpt } = require("@src/chatgpt");
const { StartButtons } = require("@src/buttons");

class BotMethods extends BotCore {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      await ctx.reply("Welcome to DefineIt!");

      const menuMsg = await ctx.reply("Menu", StartButtons);
      this.messages.push(menuMsg.message_id);

      // const { id: userID } = ctx.from;
      // const words = USERS_WORDS[userID] || [];

      // if (words.length === 0) {
      //   await ctx.reply("No word available yet!");
      //   return;
      // }

      // const { word } = words[0];
      // const waitMsg = await ctx.reply("Wait please!");
      // const response = await chatgpt.fetchWordDefinitions(word);
      // const choices = response.choices || [];
      // const definition = choices.reduce((acc, choice) => {
      //   const { message } = choice;
      //   return acc + "\n" + message["content"];
      // }, "");
      // ctx.deleteMessage(waitMsg.message_id);
      // const definitionMsg = await ctx.reply(definition, StatisticsBtns);
      // this.messages.push(definitionMsg.message_id);
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
          this.clearTranslatedWords(ctx);
          const word = ctx.update.message.text;
          const waitingMsg = await ctx.reply(`Translating - ${word}`);
          const response = await chatgpt.fetchWordDefinitions(word);
          const choices = response.choices || [];
          const definition = choices.reduce((acc, choice) => {
            const { message } = choice;
            return acc + "\n" + message["content"];
          }, "");
          ctx.deleteMessage(waitingMsg.message_id);
          const definitionMsg = await ctx.reply(definition);
          this.translatedWords.push(definitionMsg.message_id);
          break;
        default:
          ctx.deleteMessage();
      }
    });
  }

  clearMessages(ctx) {
    this.messages.forEach((i) => ctx.deleteMessage(i));
    this.messages = [];
  }

  clearTranslatedWords(ctx) {
    this.translatedWords.forEach((i) => ctx.deleteMessage(i));
    this.translatedWords = [];
  }
}

module.exports = { BotMethods };
