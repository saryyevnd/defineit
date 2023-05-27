const {
  TranslateButtons,
  AddNewWordButtons,
  PlayButtons,
} = require("@src/buttons");
const { BotMethods } = require("./bot.methods");

class BotActions extends BotMethods {
  playAction() {
    this.bot.action("play", async (ctx) => {
      await ctx.answerCbQuery();
      this.clearMessages(ctx);
      this.clearTranslatedWords(ctx);
      this.mode = "play";
      const captionMsg = await ctx.reply("Menu", PlayButtons);
      const exclamatoryMsg = await ctx.reply("Let's play!");
      this.messages.push(captionMsg.message_id);
      this.messages.push(exclamatoryMsg.message_id);
    });
  }

  addNewWordAction() {
    this.bot.action("addNewWord", async (ctx) => {
      await ctx.answerCbQuery();
      this.clearMessages(ctx);
      this.clearTranslatedWords(ctx);
      this.mode = "addNewWord";
      const captionMsg = await ctx.reply("Menu", AddNewWordButtons);
      const exclamatoryMsg = await ctx.reply("Now you can add new word!");
      this.messages.push(captionMsg.message_id);
      this.messages.push(exclamatoryMsg.message_id);
    });
  }

  translateAction() {
    this.bot.action("translate", async (ctx) => {
      await ctx.answerCbQuery();
      this.clearMessages(ctx);
      this.mode = "translate";
      const captionMsg = await ctx.reply("Menu", TranslateButtons);
      const exclamatoryMsg = await ctx.reply("Now you can translate any word!");
      this.messages.push(captionMsg.message_id);
      this.messages.push(exclamatoryMsg.message_id);
    });
  }
}

module.exports = { BotActions };
