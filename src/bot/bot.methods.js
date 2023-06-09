const { message } = require("telegraf/filters");
const { fetch } = require("@src/api");
const { StartButtons } = require("@src/buttons");
const { User } = require("@src/models");
const { BotClear } = require("./bot.clear");

class BotMethods extends BotClear {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      await this.clearChat(ctx);
      await this.reply(ctx, "Welcome to DefineIt!");

      const menuMsg = await this.reply(ctx, "Menu", StartButtons);
      this.chatMessagesId.changeMode.push(menuMsg.message_id);

      const telegramUser = ctx.from;
      const mongoUser = await User.findOne({ userId: telegramUser.id });

      // Check database if user doesn't exist
      if (!mongoUser) {
        const newUser = new User({
          userId: telegramUser.id,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          userName: telegramUser.last_name,
          words: [],
        });
        newUser.save();
      }
    });
  }

  async textMessageHanlerMethod() {
    this.bot.on(message("text"), async (ctx) => {
      this.deleteMessage(ctx);

      const text = ctx.update.message.text.toUpperCase();
      const preloaderMsg = await this.reply(ctx, `Wait!`);
      this.preloaderId = preloaderMsg.message_id;

      switch (this.mode) {
        case "play":
          this.deleteMessage(ctx);
          this.deleteMessage(ctx, this.preloaderId);
          return;
        case "addNewWord":
          return await this.addNewWordHandler(ctx, text);
        case "chatgpt":
          return await this.chatgptHandler(ctx, text);
        case "translate":
          return await this.translateHandler(ctx, text);
        default:
          await this.deleteMessage(ctx, this.preloaderId);
      }
    });

    this.bot.on(message("sticker"), (ctx) => {
      ctx.deleteMessage();
    });
  }

  async addNewWordHandler(ctx, text) {
    try {
      this.deleteMessagesByMode(ctx, this.mode);

      const telegramUser = ctx.from;
      const mongoUser = await User.findOne({ userId: telegramUser.id });
      const addNewWordMsgIds = this.chatMessagesId[this.mode];

      // Check database if word exists
      const words = mongoUser.words;
      const includes = words.some((item) => item.word === text);

      if (includes) {
        const includesMsg = await this.reply(
          ctx,
          `${text} already exists on Database!`
        );
        addNewWordMsgIds.push(includesMsg.message_id);
        this.deleteMessage(ctx, this.preloaderId);
        return;
      }

      // Check enlish dictionary if word exists
      const { doesWordExist } = await fetch.wordValidation(text);
      if (!doesWordExist) {
        const doesExistsMsg = await this.reply(
          ctx,
          `${text} doesn't exists on English dictionary!`
        );
        addNewWordMsgIds.push(doesExistsMsg.message_id);
        this.deleteMessage(ctx, this.preloaderId);
        return;
      }

      words.push({ showTime: Date.now(), word: text });
      mongoUser.words = words.sort((a, b) => b.showTime - a.showTime);
      mongoUser.save();
      const successMsg = await this.reply(ctx, `${text} successfully saved!`);
      addNewWordMsgIds.push(successMsg.message_id);
      this.deleteMessage(ctx, this.preloaderId);
      return;
    } catch (error) {
      console.error(error.message);
    } finally {
      this.deleteMessage(ctx, this.preloaderId);
    }
  }

  async chatgptHandler(ctx, text) {
    this.deleteMessagesByMode(ctx, this.mode);
    const response = await fetch.fetchChatGptRespoonse(text);
    const choices = response?.choices || [];
    const content = choices.reduce((acc, choice) => {
      const { message } = choice;
      return acc + "\n" + message["content"];
    }, "");
    const contentMsg = await this.reply(ctx, content);
    this.chatMessagesId[this.mode].push(contentMsg.message_id);

    this.deleteMessage(ctx, this.preloaderId);
  }

  async translateHandler(ctx, text, buttons = null) {
    this.deleteMessagesByMode(ctx, this.mode);
    const definition = await fetch.fetchDefinition(text);
    const definitionMsg = await this.reply(ctx, definition, buttons);
    this.chatMessagesId[this.mode].push(definitionMsg.message_id);
    this.deleteMessage(ctx, this.preloaderId);
  }
}

module.exports = { BotMethods };
