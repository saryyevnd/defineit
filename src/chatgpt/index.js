const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_TOKEN } = require("./../utils");

class ChatGPT {
  #model = "gpt-3.5-turbo";
  #token = null;
  #configuration = null;
  #openai = null;

  #getContent(word) {
    return `Give definition word ${word}, show russian translation and use it in five simple sentences`;
  }

  constructor(token = "") {
    if (ChatGPT.hasToken) {
      return ChatGPT.instance;
    }
    ChatGPT.instance = this;
    ChatGPT.hasToken = true;
    this.#token = token;
    this.#configuration = new Configuration({ apiKey: this.#token });
    this.#openai = new OpenAIApi(this.#configuration);
  }

  async fetchWordDefinitions(word = "") {
    const response = await this.#openai.createChatCompletion({
      model: this.#model,
      messages: [{ role: "user", content: this.#getContent(word) }],
    });

    return response.data;
  }
}

const chatgpt = new ChatGPT(OPENAI_TOKEN);

module.exports = { chatgpt };
