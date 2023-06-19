const {
  TranslateButtons,
  AddNewWordButtons,
  PlayButtons,
  ChatGptButtons,
} = require("@src/buttons");
const { BotMethods } = require("./bot.methods");

class BotActions extends BotMethods {
  async actionDefault(ctx, mode = "", buttons, caption) {
    await ctx.answerCbQuery();
    this.modes.forEach(async (key) => await this.clearMessagesByMode(ctx, key));
    this.mode = mode;

    const menuMsg = await this.reply(ctx, "Menu", buttons);
    const exclamatoryMsg = await this.reply(ctx, caption);

    this.chatMessagesId.changeMode.push(menuMsg.message_id);
    this.chatMessagesId.changeMode.push(exclamatoryMsg.message_id);
  }

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
}

module.exports = { BotActions };
