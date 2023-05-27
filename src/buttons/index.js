const { Markup } = require("telegraf");
const { inlineKeyboard, button } = Markup;

const PlayBtn = button.callback("Play", "play");
const AddNewWordBtn = button.callback("Add new word", "addNewWord");
const TranslateBtn = button.callback("Translate", "translate");

const StartButtons = inlineKeyboard([
  [PlayBtn],
  [AddNewWordBtn],
  [TranslateBtn],
]);
const PlayButtons = inlineKeyboard([[AddNewWordBtn], [TranslateBtn]]);
const AddNewWordButtons = inlineKeyboard([[PlayBtn], [TranslateBtn]]);
const TranslateButtons = inlineKeyboard([[PlayBtn], [AddNewWordBtn]]);
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
};
