const utils = require("@src/utils");
const chatgpt = require("@src/chatgpt");
const bot = require("@src/bot");

module.exports = { ...utils, ...chatgpt, ...bot };
