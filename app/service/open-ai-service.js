const { Configuration, OpenAIApi } = require("openai");
const constants = require("../common/constants");
const config = require("../../config");

class OpenAIService {
  static async rewrite(text) {
    return new Promise((resolve, reject) => {
      const configuration = new Configuration({
        apiKey: config.OPEN_AI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      openai
        .createCompletion({
          model: constants.OpenAiConstants.MODEL_NAME,
          prompt: text,
          //   rewrite: "crisp, formal",
        })
        .then((response) => {
          resolve(response.data.choices[0].text);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }
}
module.exports = OpenAIService;
