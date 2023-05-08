const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_TOKEN } = require("./../utils");

const configuration = new Configuration({
  apiKey: OPENAI_TOKEN,
});

async function fetchWordDefinition(word = "") {
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Give definition word ${word}, show russian translation and use it in five simple sentences.`,
      },
    ],
  });

  return response.data.choices[0].message;
}

module.exports = { fetchWordDefinition };
