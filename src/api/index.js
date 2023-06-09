const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_TOKEN } = require("@src/utils");
const { default: Axios } = require("axios");

const axios = Axios.create({
  baseURL: "https://api.dictionaryapi.dev/api/v2/entries/en/",
});

class Fetch {
  #chatgptModel = "";
  #token = null;
  #configuration = null;
  #openai = null;

  #getWordDefinition4Chatgpt(word) {
    return `Give definition word ${word}, show russian translation and use it in five simple sentences.`;
  }

  constructor(token = "", chatgptModel = "gpt-3.5-turbo") {
    if (Fetch.hasToken) {
      return Fetch.instance;
    }
    Fetch.instance = this;
    Fetch.hasToken = true;

    this.#token = token;
    this.#configuration = new Configuration({ apiKey: this.#token });
    this.#openai = new OpenAIApi(this.#configuration);
    this.#chatgptModel = chatgptModel;
  }

  async wordValidation(word) {
    try {
      const response = await axios.get(word);
      const data = response.data;

      if (Array.isArray(data)) {
        return { doesWordExist: true };
      }
      return { doesWordExist: false };
    } catch {
      return { doesWordExist: false };
    }
  }

  async fetchChatGptRespoonse(content) {
    console.log(this.#chatgptModel);
    console.log(this.#token);
    console.log(content);
    try {
      const response = await this.#openai.createChatCompletion({
        model: this.#chatgptModel,
        messages: [{ role: "user", content }],
      });
      return response.data;
    } catch (error) {
      console.log("Error: ", error.message);
    }
  }

  async fetchDefinition(word) {
    try {
      const response = await axios.get(word);
      const data = response.data;
      const dataString = this.dataToString(data);
      return dataString.slice(0, 3000);
    } catch {
      return "Word not found!";
    }
  }

  dataToString(datas = []) {
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

    return datas.reduce((dataAcc, data) => {
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
  }
}

const fetch = new Fetch(OPENAI_TOKEN);

module.exports = { fetch };
