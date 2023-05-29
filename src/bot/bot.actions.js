const {
  TranslateButtons,
  AddNewWordButtons,
  PlayButtons,
} = require("@src/buttons");
const { BotMethods } = require("./bot.methods");

class BotActions extends BotMethods {
  playAction() {
    this.bot.action("play", async (ctx) => {
      this.actionDefault(ctx, "play", PlayButtons, "Let's play!");
    });
  }

  addNewWordAction() {
    this.bot.action("addNewWord", async (ctx) => {
      this.actionDefault(
        ctx,
        "addNewWord",
        AddNewWordButtons,
        "Now you can add new word!"
      );
    });
  }

  translateAction() {
    this.bot.action("translate", async (ctx) => {
      this.actionDefault(
        ctx,
        "translate",
        TranslateButtons,
        "Now you can translate any word!"
      );
    });
  }

  async actionDefault(ctx, mode = "", buttons, caption) {
    await ctx.answerCbQuery();
    this.clearMessages(ctx);
    this.clearTextMessages(ctx);
    this.mode = mode;
    const captionMsg = await ctx.reply("Menu", buttons);
    const exclamatoryMsg = await ctx.reply(caption);
    this.messages.push(captionMsg.message_id);
    this.messages.push(exclamatoryMsg.message_id);
  }
}

module.exports = { BotActions };
