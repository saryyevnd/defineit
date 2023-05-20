const { BotMethods } = require("./bot.methods");

class BotActions extends BotMethods {
  trainingAction() {
    this.bot.action("training", async (ctx) => {
      this.isHideBtn = false;
      await ctx.answerCbQuery();
      await ctx.reply("Training");
    });
  }

  enterNewWordAction() {
    this.bot.action("enterNewWord", async (ctx) => {
      this.isHideBtn = true;
      await ctx.answerCbQuery();
      await ctx.reply("Enter a new Word");
    });
  }
}

module.exports = { BotActions };
