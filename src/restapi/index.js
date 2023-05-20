const express = require("express");
const expressApp = express();

class RestAPI {
  #port = process.env.PORT || 3000;

  start() {
    expressApp.get("/", (req, res) => {
      res.send("Welcome to DefineIt!");
    });

    expressApp.listen(this.#port, () => {
      console.log(`Listening on port ${this.#port}`);
    });
  }
}

const restapi = new RestAPI();

module.exports = { restapi };
