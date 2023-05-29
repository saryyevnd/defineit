const {
  TranslateButtons,
  AddNewWordButtons,
  PlayButtons,
  ChatGptButtons,
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
  chatgptAction() {
    this.bot.action("chatgpt", async (ctx) => {
      this.actionDefault(
        ctx,
        "chatgpt",
        ChatGptButtons,
        "Now you can use chatgpt!"
      );
    });
  }

  async actionDefault(ctx, mode = "", buttons, caption) {
    await ctx.answerCbQuery();
    this.clearMessagesForChangeMode(ctx);
    this.clearTranslatedWord(ctx);
    this.mode = mode;
    const captionMsg = await ctx.reply("Menu", buttons);
    const exclamatoryMsg = await ctx.reply(caption);
    this.chatMessagesId.forChangeMode.push(captionMsg.message_id);
    this.chatMessagesId.forChangeMode.push(exclamatoryMsg.message_id);

    this.chatMessagesId.all.push(captionMsg.message_id);
    this.chatMessagesId.all.push(exclamatoryMsg.message_id);
    11;
  }
}

module.exports = { BotActions };
