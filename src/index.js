const utils = require("@src/utils");
const chatgpt = require("@src/chatgpt");
const bot = require("@src/bot");
const restapi = require("@src/restapi");

module.exports = { ...utils, ...chatgpt, ...bot, ...restapi };
