const { Markup } = require("telegraf");
const { inlineKeyboard, button } = Markup;

const PlayBtn = button.callback("Play", "play");
const AddNewWordBtn = button.callback("Add new word", "addNewWord");
const TranslateBtn = button.callback("Translate", "translate");
const ChatGptBtn = button.callback("Chatgpt", "chatgpt");

const StartButtons = inlineKeyboard([
  [PlayBtn],
  [AddNewWordBtn],
  [TranslateBtn],
  [ChatGptBtn],
]);

const PlayButtons = inlineKeyboard([
  [AddNewWordBtn],
  [TranslateBtn],
  [ChatGptBtn],
]);

const AddNewWordButtons = inlineKeyboard([
  [PlayBtn],
  [TranslateBtn],
  [ChatGptBtn],
]);

const TranslateButtons = inlineKeyboard([
  [PlayBtn],
  [AddNewWordBtn],
  [ChatGptBtn],
]);

const ChatGptButtons = inlineKeyboard([
  [PlayBtn],
  [AddNewWordBtn],
  [TranslateBtn],
]);

const StatisticsButtons = [
  button.callback("Easy", "easy"),
  button.callback("Medium", "medium"),
  button.callback("Hard", "hard"),
  button.callback("Done", "done"),
];

module.exports = {
  StartButtons,
  PlayButtons,
  AddNewWordButtons,
  TranslateButtons,
  StatisticsButtons,
  ChatGptButtons,
};
