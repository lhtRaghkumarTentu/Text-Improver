import { httpConstants, apiFailureMessage } from "../../common/constants";
import OpenAIService from "../../service/open-ai-service";
import HttpService from "../../service/http-service";
import cheerio from "cheerio";
import Utils from "../../utils";

export default class Manger {
  getStringSuggestions = async (req) => {
    try {
      const htmlStrings = await this.getHtmlStrings(req.url);
      const textsArray = await this.getContentFromHtml(htmlStrings);
      const filterObjects = await this.getFilteredObjects(textsArray);
      if (!filterObjects || filterObjects.length === 0) {
        return Utils.returnRejection(
          apiFailureMessage.FETCH_FILTER_OBJECTS_FAIL,
          httpConstants.RESPONSE_CODES.BAD_REQUEST
        );
      }
      const suggestions = await Promise.all(
        filterObjects.slice(1, 3).map(async (object) => {
          const key = Object.keys(object)[0];
          const [version1, version2] = await Promise.all([
            OpenAIService.rewrite(object[key]),
            OpenAIService.rewrite(object[key]),
          ]);
          return {
            original: object[key],
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
      return suggestions;
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
        // const pattern = /^[^>{}"]+$/;
        // const forbiddenChars = /[#>{}]|^\s*$/;
        // Trim the value and check for special characters, emptiness and whitespace
        if (pattern.test(object[key].trim()) || object[key].trim() === "") {
          return false;
        }
      }
      return true;
    });
  };
}
