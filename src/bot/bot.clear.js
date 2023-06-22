const { BotCore } = require("./bot.core");

class BotClear extends BotCore {
  async deleteMessage(ctx, msgId) {
    try {
      if (msgId) {
        await ctx.deleteMessage(msgId);
        return;
      }
      await ctx.deleteMessage();
    } catch (error) {
      console.log(error.message);
    }
  }

  async clearChat(ctx) {
    await this.deleteMessage(ctx);
    this.chatMessagesId.all.forEach(async (message_id) => {
      try {
        await ctx.deleteMessage(message_id);
      } catch (error) {
        console.log(error.message);
      }
    });
    this.chatMessagesId.all = [];

    Object.keys(this.chatMessagesId).forEach(
      (key) => (this.chatMessagesId[key] = [])
    );

    this.mode = "";
  }

  async deleteMessagesByMode(ctx, mode) {
    this.chatMessagesId[mode].forEach(async (i) => {
      try {
        await ctx.deleteMessage(i);
      } catch (error) {
        console.log(error.message);
      }
    });
    this.chatMessagesId[mode] = [];
  }
}

module.exports = { BotClear };
