import Utils from "../../utils";
import BLManager from "./manager";
import HTTPHandler from "../../utils/HTTPHandler";
import { apiSuccessMessage, httpConstants } from "../../common/constants";

export default class Index {
  async getTextSuggestions(request, response) {
    const [error, stringResponse] = await Utils.parseResponse(
      new BLManager().getStringSuggestions(request.query)
    );
    if (!stringResponse) {
      return HTTPHandler.error(
        response,
        error,
        error && error.message ? error.message : error
      );
    }
    return HTTPHandler.response(
      response,
      stringResponse,
      apiSuccessMessage.FETCH_SUCCESS,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }
}
