const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_TOKEN } = require("@src/utils");
const { default: Axios } = require("axios");

const axios = Axios.create({
  baseURL: "https://api.dictionaryapi.dev/api/v2/entries/en/",
});

class Fetch {
  #model = "gpt-3.5-turbo";
  #token = null;
  #configuration = null;
  #openai = null;

  #getContent(word) {
    return `Give definition word ${word}, show russian translation and use it in five simple sentences.`;
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

  async wordValidation(word) {
    try {
      const checkWordValidation = await axios.get(word);

      const data = checkWordValidation.data;
      if (Array.isArray(data)) {
        return { valid: true };
      }

      return { valid: false };
    } catch {
      return { valid: false };
    }
  }

  async fetchWordDefinitions(word = "") {
    // const response = await this.#openai.createChatCompletion({
    //   model: this.#model,
    //   messages: [{ role: "user", content: this.#getContent(word) }],
    // });
    try {
      const datas = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = datas.data;
    } catch {
      return "";
    }

    return response.data;
  }

  dataToString(datas) {
    if (Array.isArray(datas)) {
      const getDefinition = (definitions = []) => {
        return definitions.reduce((acc, { definition, example }, index) => {
          return (
            acc +
            `  ${index + 1}) definition: ${definition}    ${
              example ? "\n     example: " + example : ""
            }\n`
          );
        }, "");
      };

      const datasString = datas.reduce((dataAcc, data) => {
        const { meanings, word } = data || [];
        const meaningsString = meanings.reduce(
          (meaningAcc, { partOfSpeech, definitions, synonyms }) => {
            const definitionString = getDefinition(definitions);
            return (
              meaningAcc + " " + partOfSpeech + "\n" + definitionString + "\n"
            );
          },
          ""
        );
        return dataAcc + `${word} ` + "\n" + meaningsString;
      }, "");
      return datasString;
    }
    return "";
  }
}

const fetch = new Fetch(OPENAI_TOKEN);

module.exports = { fetch };
