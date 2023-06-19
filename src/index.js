const utils = require("@src/utils");
const api = require("@src/api");
const bot = require("@src/bot");
const restapi = require("@src/restapi");
const buttons = require("@src/buttons");
const mockData = require("@src/mock");
const models = require("@src/models");

module.exports = {
  ...utils,
  ...api,
  ...bot,
  ...restapi,
  ...buttons,
  ...mockData,
  ...models,
};
