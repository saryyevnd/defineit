const {
  TranslateButtons,
  AddNewWordButtons,
  PlayButtons,
  ChatGptButtons,
  StatisticsButtons,
  showDefinitionButton,
} = require("@src/buttons");
const { BotMethods } = require("./bot.methods");
const { User } = require("../models");
const { capitalize } = require("../utils");

class BotActions extends BotMethods {
  async menuButtonActionDefault(ctx, mode = "", buttons, caption) {
    await ctx.answerCbQuery();
    this.modes.forEach(
      async (mode) => await this.deleteMessagesByMode(ctx, mode)
    );
    this.mode = mode;

    const menuMsg = await this.reply(ctx, "Menu", buttons);
    this.chatMessagesId.changeMode.push(menuMsg.message_id);

    const exclamatoryMsg = await this.reply(ctx, caption);
    this.chatMessagesId.changeMode.push(exclamatoryMsg.message_id);
  }

  playAction() {
    this.bot.action("play", async (ctx) => {
      await this.menuButtonActionDefault(
        ctx,
        "play",
        PlayButtons,
        "Let's play!"
      );
      await this.showAvailableWord(ctx);
    });
  }

  async showAvailableWord(ctx) {
    this.deleteMessagesByMode(ctx, this.mode);
    const telegramUser = ctx.from;
    const mongoUser = await User.findOne({ userId: telegramUser.id });
    const words = mongoUser.words;
    const lastWord = words[words.length - 1];

    if (!lastWord || lastWord.showTime > Date.now()) {
      const noWordMsg = await this.reply(ctx, "No word available!");
      this.chatMessagesId[this.mode].push(noWordMsg.message_id);
      return;
    }
    this.currentWord = lastWord;
    const wordMsg = await this.reply(
      ctx,
      capitalize(lastWord.word),
      showDefinitionButton
    );
    this.chatMessagesId[this.mode].push(wordMsg.message_id);
  }

  showDefinitionAction() {
    this.bot.action("showDefinition", async (ctx) => {
      try {
        await this.translateHandler(
          ctx,
          this.currentWord.word,
          StatisticsButtons
        );
      } catch (error) {
        console.error(error.message);
      }
    });
  }

  async statisticsActions() {
    this.bot.action("easy", async (ctx) => {
      await this.handleStatisticButtons(ctx, this.timeIncrements["1day"]);
      await this.showAvailableWord(ctx);
    });

    this.bot.action("medium", async (ctx) => {
      await this.handleStatisticButtons(ctx, this.timeIncrements["6hours"]);
      await this.showAvailableWord(ctx);
    });

    this.bot.action("hard", async (ctx) => {
      await this.handleStatisticButtons(ctx, this.timeIncrements["1hour"]);
      await this.showAvailableWord(ctx);
    });

    this.bot.action("remove", async (ctx) => {
      const telegramUser = ctx.from;
      const mongoUser = await User.findOne({ userId: telegramUser.id });
      mongoUser.words = mongoUser.words.filter(
        (item) => item.word !== this.currentWord.word
      );
      mongoUser.words = mongoUser.words.sort((a, b) => b.showTime - a.showTime);
      await mongoUser.save();
      await this.showAvailableWord(ctx);
    });
  }

  async handleStatisticButtons(ctx, addTime = 3_600_000) {
    const telegramUser = ctx.from;
    const mongoUser = await User.findOne({ userId: telegramUser.id });
    const word = mongoUser.words.find(
      (item) => item.word === this.currentWord.word
    );
    word.showTime = Date.now() + addTime;
    mongoUser.words = mongoUser.words.sort((a, b) => b.showTime - a.showTime);
    await mongoUser.save();
  }

  addNewWordAction() {
    this.bot.action("addNewWord", async (ctx) => {
      this.menuButtonActionDefault(
        ctx,
        "addNewWord",
        AddNewWordButtons,
        "Now you can add new word!"
      );
    });
  }

  translateAction() {
    this.bot.action("translate", async (ctx) => {
      this.menuButtonActionDefault(
        ctx,
        "translate",
        TranslateButtons,
        "Now you can translate any word!"
      );
    });
  }

  chatgptAction() {
    this.bot.action("chatgpt", async (ctx) => {
      this.menuButtonActionDefault(
        ctx,
        "chatgpt",
        ChatGptButtons,
        "Now you can use chatgpt!"
      );
    });
  }
}

module.exports = { BotActions };
