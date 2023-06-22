const tokens = require("@src/utils/tokens");

const capitalize = (str = "") =>
  str[0].toUpperCase() + str?.slice(1)?.toLowerCase();

module.exports = { ...tokens, capitalize };
