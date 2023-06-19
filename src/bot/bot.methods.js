const { message } = require("telegraf/filters");
const { fetch } = require("@src/api");
const { StartButtons } = require("@src/buttons");
const { User } = require("@src/models");
const { BotClear } = require("./bot.clear");

class BotMethods extends BotClear {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      await this.clearChat(ctx);
      Object.keys(this.chatMessagesId).forEach(
        (key) => (this.chatMessagesId[key] = [])
      );
      this.mode = "";
      await this.reply(ctx, "Welcome to DefineIt!");
      const menuMsg = await this.reply(ctx, "Menu", StartButtons);
      this.chatMessagesId.changeMode.push(menuMsg.message_id);
    });
  }

  async wordHandlerMethod() {
    this.bot.on(message("text"), async (ctx) => {
      this.deleteMessage(ctx);

      const text = ctx.update.message.text.toUpperCase();
      const waitingMsg = await this.reply(ctx, `Wait!`);
      this.waitingMsgId = waitingMsg.message_id;

      switch (this.mode) {
        case "play":
          console.log("play");
          return;
        case "addNewWord":
          return await this.addNewWordHandler(ctx, text);
        case "chatgpt":
          return await this.chatgptHandler(ctx, text);
        case "translate":
          return await this.translateHandler(ctx, text);
        default:
          await this.deleteMessage();
      }
    });

    this.bot.on(message("sticker"), (ctx) => {
      ctx.deleteMessage();
    });
  }

  async addNewWordHandler(ctx, text) {
    try {
      this.clearMessagesByMode(ctx, this.mode);

      const telegramUser = ctx.from;
      const mongoUser = await User.findOne({ userId: telegramUser.id });

      // Check database if user doesn't exist
      if (!mongoUser) {
        const newUser = new User({
          userId: telegramUser.id,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          userName: telegramUser.last_name,
          words: [{ showTime: Date.now(), word: text }],
        });
        newUser.save();
        this.deleteMessage(ctx, this.waitingMsgId);
        return;
      }

      // Check database if word exists
      const words = mongoUser.words;
      const includes = words.some((item) => item.word === text);

      if (includes) {
        const includesMsg = await this.reply(
          ctx,
          `${text} already exists on Database!`
        );
        this.chatMessagesId.addNewWord.push(includesMsg.message_id);
        this.deleteMessage(ctx, this.waitingMsgId);
        return;
      }
      // Check enlish dictionary if word exists
      const { doesWordExist } = await fetch.wordValidation(word);
      if (!doesWordExist) {
        const doesExistsMsg = await this.reply(
          ctx,
          `${text} doesn't exists on English dictionary!`
        );
        this.chatMessagesId.addNewWord.push(doesExistsMsg.message_id);
        this.deleteMessage(ctx, this.waitingMsgId);
        return;
      }

      words.push({ showTime: Date.now(), word: text });
      mongoUser.words = words.sort((a, b) => a.showTime - b.showTime);
      mongoUser.save();
      const successMsg = await this.reply(ctx, `${text} successfully saved!`);
      this.chatMessagesId.addNewWord.push(successMsg.message_id);
      this.deleteMessage(ctx, this.waitingMsgId);
      return;
    } catch (error) {
      console.error(error.message);
    } finally {
      this.deleteMessage(ctx, this.waitingMsgId);
    }
  }

  async chatgptHandler(ctx, text) {
    this.clearMessagesByMode(ctx, this.mode);
    const response = await fetch.fetchChatGptRespoonse(text);
    const choices = response?.choices || [];
    const content = choices.reduce((acc, choice) => {
      const { message } = choice;
      return acc + "\n" + message["content"];
    }, "");
    const contentMsg = await ctx.reply(content);
    this.chatMessagesId.chatgpt.push(contentMsg.message_id);
    this.chatMessagesId.all.push(contentMsg.message_id);
    this.deleteMessage(ctx, this.waitingMsgId);
  }

  async translateHandler(ctx, text) {
    this.clearMessagesByMode(ctx, this.mode);
    const definition = await fetch.fetchDefinition(text);
    const definitionMsg = await this.reply(ctx, definition);
    this.chatMessagesId.translate.push(definitionMsg.message_id);
    this.deleteMessage(ctx, this.waitingMsgId);
  }
}

module.exports = { BotMethods };
