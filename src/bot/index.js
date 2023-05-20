const { BotActions } = require("./bot.actions");

class Bot extends BotActions {
  start() {
    this.startReplyMethod();
    // use middleware
    this.wordHandlerMethod();
    this.trainingAction();
    this.enterNewWordAction();
    this.bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }
}

module.exports = { Bot };
