const { BotActions } = require("./bot.actions");

class Bot extends BotActions {
  start() {
    this.startReplyMethod();
    // Here you can register midllewares
    this.textMessageHanlerMethod();

    // Menu button actions
    this.playAction();
    this.addNewWordAction();
    this.translateAction();
    this.chatgptAction();

    //
    this.showDefinitionAction();
    this.statisticsActions();

    this.bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }
}

module.exports = { Bot };
