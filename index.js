require("module-alias/register");

const { TELEGRAM_TOKEN, Bot } = require("@src");
const express = require("express");
const expressApp = express();
const port = process.env.PORT || 3000;

expressApp.get("/", (req, res) => {
  res.send("Welcome to DefineIt!");
});

expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const bot = new Bot(TELEGRAM_TOKEN);

bot.start();
