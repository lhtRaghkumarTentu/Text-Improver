import {
  apiFailureMessage,
  apiSuccessMessage,
  httpConstants,
} from "../common/constants";

export default class HTTPHandler {
  static success(res, data, message = apiSuccessMessage.FETCH_SUCCESS) {
    HTTPHandler.response(
      res,
      data,
      message,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  static accepted(res, data, message = apiSuccessMessage.POST_SUCCESS_MESSAGE) {
    HTTPHandler.response(
      res,
      data,
      message,
      httpConstants.RESPONSE_STATUS.SUCCESS,
      httpConstants.RESPONSE_CODES.OK
    );
  }

  static unauthorized(res, data, message) {
    HTTPHandler.response(
      res,
      data,
      message,
      httpConstants.RESPONSE_STATUS.FAILURE,
      httpConstants.RESPONSE_CODES.UNAUTHORIZED
    );
  }

  static badRequest(res, data, message) {
    HTTPHandler.response(
      res,
      data,
      message,
      httpConstants.RESPONSE_STATUS.FAILURE,
      httpConstants.RESPONSE_CODES.BAD_REQUEST
    );
  }

  static notFoundError(res, data, message) {
    HTTPHandler.response(
      res,
      data,
      message,
      httpConstants.RESPONSE_STATUS.FAILURE,
      httpConstants.RESPONSE_CODES.NOT_FOUND
    );
  }

  static error(res, data, message = apiFailureMessage.INTERNAL_SERVER_ERROR) {
    HTTPHandler.response(
      res,
      {},
      message,
      httpConstants.RESPONSE_STATUS.FAILURE,
      httpConstants.RESPONSE_CODES.SERVER_ERROR
    );
  }

  static validationError(res, errorArray) {
    HTTPHandler.response(
      res,
      errorArray,
      "Invalid Request!",
      httpConstants.RESPONSE_STATUS.FAILURE,
      httpConstants.RESPONSE_CODES.SERVER_ERROR
    );
  }

  static response(res, data, message, success, code) {
    const responseObj = {
      responseData: data,
      message: message,
      success: success,
      responseCode: code,
    };
    res.format({
      json: () => {
        res.send(responseObj);
      },
    });
  }
}
