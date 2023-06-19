const { BotCore } = require("./bot.core");
const { message } = require("telegraf/filters");
const { fetch } = require("@src/api");
const { StartButtons } = require("@src/buttons");
const { User } = require("@src/models");

class BotMethods extends BotCore {
  startReplyMethod() {
    this.bot.start(async (ctx) => {
      this.clearChat(ctx);
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
      const waitingMsgId = waitingMsg.message_id;

      switch (this.mode) {
        case "play":
          console.log("play");
          break;
        case "addNewWord":
          const telegramUser = ctx.from;
          const mongoUser = await User.findOne({ userId: telegramUser.id });

          if (!mongoUser) {
            const newUser = new User({
              userId: telegramUser.id,
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
              userName: telegramUser.last_name,
              words: [{ showTime: Date.now(), word: text }],
            });
            newUser.save();
            this.deleteMessage(ctx, waitingMsgId);
            return;
          }

          const words = mongoUser.words;
          const includes = words.some((item) => item.word === text);

          if (includes) {
            this.deleteMessage(ctx, waitingMsgId);
            break;
          }

          words.push({ showTime: Date.now(), word: text });
          mongoUser.words = words.sort((a, b) => a.showTime - b.showTime);
          mongoUser.save();

          this.deleteMessage(ctx, waitingMsgId);
          break;
        case "chatgpt":
          this.clearChatgpt(ctx);
          const response = await fetch.fetchChatGptRespoonse(text);
          const choices = response?.choices || [];
          const content = choices.reduce((acc, choice) => {
            const { message } = choice;
            return acc + "\n" + message["content"];
          }, "");
          const contentMsg = await ctx.reply(content);
          this.chatMessagesId.chatgpt.push(contentMsg.message_id);
          this.chatMessagesId.all.push(contentMsg.message_id);
          this.deleteMessage(ctx, waitingMsgId);
          break;
        case "translate":
          this.clearTranslate(ctx);
          const definition = await fetch.fetchDefinition(text);
          const definitionMsg = await ctx.reply(definition);
          this.chatMessagesId.translate.push(definitionMsg.message_id);
          this.chatMessagesId.all.push(definitionMsg.message_id);
          this.deleteMessage(ctx, waitingMsgId);
          return;
        default:
          try {
            await ctx.deleteMessage();
          } catch (error) {
            console.log(error.message);
          }
      }
    });

    this.bot.on(message("sticker"), (ctx) => {
      ctx.deleteMessage();
    });
  }

  deleteMessage(ctx, msgId) {
    try {
      if (msgId) {
        ctx.deleteMessage(msgId);
        return;
      }
      ctx.deleteMessage();
    } catch (error) {
      console.log(error.message);
    }
  }

  async clearChat(ctx) {
    this.deleteMessage(ctx);
    this.chatMessagesId.all.forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (error) {
        console.log(error.message);
      }
    });
    this.chatMessagesId.all = [];
  }

  async clearMessages(ctx, key) {
    this.chatMessagesId[key].forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (error) {
        console.log(error.message);
      }
    });
    this.chatMessagesId[key] = [];
  }

  clearPlay(ctx) {
    this.clearMessages(ctx, "play");
  }

  clearChangeMode(ctx) {
    this.clearMessages(ctx, "changeMode");
  }

  clearTranslate(ctx) {
    this.clearMessages(ctx, "translate");
  }

  clearChatgpt(ctx) {
    this.clearMessages(ctx, "chatgpt");
  }
}

module.exports = { BotMethods };
