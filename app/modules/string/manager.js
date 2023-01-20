import { httpConstants, apiFailureMessage } from "../../common/constants";
import OpenAIService from "../../service/open-ai-service";
import HttpService from "../../service/http-service";
const cheerio = require("cheerio");
import Utils from "../../utils";

export default class Manger {
  getStringSuggestions = async ({ url, ownKeyWord, skip = 1, limit = 10 }) => {
    try {
      const htmlStrings = await this.getHtmlStrings(url);
      const textsArray = await this.getContentFromHtml(htmlStrings);
      const filterObjects = await this.getFilteredObjects(textsArray);
      if (!filterObjects || filterObjects.length === 0) {
        return Utils.returnRejection(
          apiFailureMessage.FETCH_FILTER_OBJECTS_FAIL,
          httpConstants.RESPONSE_CODES.BAD_REQUEST
        );
      }
      const phrase = ownKeyWord ? "rewrite for Seo Keyword " : "";
      const keyWord = ownKeyWord ? ownKeyWord : "";
      const suggestions = await Promise.all(
        filterObjects.slice(3, 5).map(async (object) => {
          const key = Object.keys(object)[0];
          const [version1, version2] = await Promise.all([
            OpenAIService.rewrite(phrase + keyWord + " " + object[key]),
            OpenAIService.rewrite(phrase + keyWord + " " + object[key]),
          ]);
          return {
            original: phrase + keyWord + " " + object[key],
            V1: version1.trim().replace(/(\n|\t|\s{2,})/g, ""),
            V2: version2.trim().replace(/(\n|\t|\s{2,})/g, ""),
          };
        })
      );
      if (!suggestions || suggestions.length === 0) {
        return Utils.returnRejection(
          apiFailureMessage.FETCH_SUGGESTIONS_FAIL,
          httpConstants.RESPONSE_CODES.BAD_REQUEST
        );
      }
      const startIndex = (skip - 1) * limit;
      const endIndex = skip * limit;
      return suggestions.slice(startIndex, endIndex);
    } catch (err) {
      return Utils.returnRejection(
        err.message,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    }
  };

  getHtmlStrings = async (url) => {
    if (!url) {
      return Utils.returnRejection(
        apiFailureMessage.INVALID_PARAMS,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    }
    try {
      return await HttpService.executeHTTPRequest(
        httpConstants.METHOD_TYPE.GET,
        url,
        "/",
        {},
        { headers: { "content-type": httpConstants.HEADER_TYPE.URL_ENCODED } }
      );
    } catch (err) {
      throw new Error(apiFailureMessage.FETCH_HTML_FAIL);
    }
  };

  getContentFromHtml = async (html) => {
    if (!html) {
      return Utils.returnRejection(
        apiFailureMessage.INVALID_PARAMS,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    }
    const $ = cheerio.load(html);
    const contentTexts = $("*")
      .contents()
      .map(function () {
        if (this.type === "text") {
          const trimData = this.data.replace(/[\t\n\t]/g, "");
          return {
            [this.parent.name]: trimData,
          };
        }
      })
      .get();
    return contentTexts;
  };

  getFilteredObjects = async (textObjectsArray) => {
    if (!textObjectsArray || textObjectsArray.length == 0) {
      return Utils.returnRejection(
        apiFailureMessage.INVALID_PARAMS,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    }
    //filtering Objects by String Patterns and empty strings
    return textObjectsArray.filter((object) => {
      for (let key in object) {
        // Pattrn for string
        const pattern = /[^a-zA-Z0-9 .,"'’]/;
        // Remove les than 4 words....
        //

        // const pattern = /^[^>{}"]+$/;
        // const forbiddenChars = /[#>{}]|^\s*$/;
        // Trim the value and check for special characters, emptiness and whitespace
        if (
          pattern.test(object[key].trim()) ||
          object[key].trim() === "" ||
          object[key].split(" ").length < 4
        ) {
          return false;
        }
      }
      return true;
    });
  };

  getDensityOfWord = async ({ url, skip = 1, limit = 10 }) => {
    try {
      const htmlStrings = await this.getHtmlStrings(url);
      const textsArray = await this.getContentFromHtml(htmlStrings);
      const filteredObjects = textsArray.filter((object) => {
        for (let key in object) {
          const pattern = /[^a-zA-Z0-9 .,"'’]/;
          if (pattern.test(object[key].trim()) || object[key].trim() === "") {
            return false;
          }
        }
        return true;
      });

      // Total number of words
      let totalWords = 0;
      // Object to store the word counts
      let wordCounts = {};

      filteredObjects.forEach((obj) => {
        for (let key in obj) {
          // Get the text
          let text = obj[key];
          // Split the text into words
          let words = text.split(/\s+/);
          // Increase the total word count
          totalWords += words.length;
          // Count the occurrences of each word
          words.forEach((word) => {
            word = word.toLowerCase();
            if (word.length >= 5) {
              wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
            }
          });
        }
      });

      // Calculate the density of each word and store it in an array
      const densities = [];
      for (let word in wordCounts) {
        let count = wordCounts[word];
        let density = (count / totalWords) * 100;
        densities.push({ word, count, density: density.toFixed(2) });
      }

      // Sort the densities array by count
      densities.sort((a, b) => b.count - a.count);

      // pagination
      const startIndex = (skip - 1) * limit;
      const endIndex = skip * limit;
      return densities.slice(startIndex, endIndex);
    } catch (error) {
      return Utils.returnRejection(
        error.message,
        httpConstants.RESPONSE_CODES.BAD_REQUEST
      );
    }
  };
}
