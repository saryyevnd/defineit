const utils = require("@src/utils");
const api = require("@src/api");
const bot = require("@src/bot");

module.exports = { ...utils, ...api, ...bot };
