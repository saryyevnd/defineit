const { BotActions } = require("./bot.actions");

class Bot extends BotActions {
  start() {
    this.startReplyMethod();
    // this.bot.use(async (ctx, next) => {
    //   console.log("this.mode");
    //   await next();
    // });
    // use middleware
    this.wordHandlerMethod();
    // actions
    this.playAction();
    this.addNewWordAction();
    this.translateAction();
    this.chatgptAction();

    this.bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }
}

module.exports = { Bot };
