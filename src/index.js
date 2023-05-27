const utils = require("@src/utils");
const chatgpt = require("@src/chatgpt");
const bot = require("@src/bot");
const restapi = require("@src/restapi");
const buttons = require("@src/buttons");
const mockData = require("@src/mock");

module.exports = {
  ...utils,
  ...chatgpt,
  ...bot,
  ...restapi,
  ...buttons,
  ...mockData,
};
