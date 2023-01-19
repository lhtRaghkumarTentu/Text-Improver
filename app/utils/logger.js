import Config from "../../config";
import Utils from "./index";
import { httpConstants } from "../common/constants";

export default class LHTLogger {
  static info(functionName, message, payload = {}, devAlias = "") {
    if (Config.IS_CONSOLE_LOG !== "true") return;
    LHTLogger.log(
      functionName,
      message,
      payload,
      devAlias,
      httpConstants.LOG_LEVEL_TYPE.INFO
    );
  }

  static debug(functionName, message, payload = {}, devAlias = "") {
    if (Config.IS_CONSOLE_LOG !== "true") return;
    LHTLogger.log(
      functionName,
      message,
      payload,
      devAlias,
      httpConstants.LOG_LEVEL_TYPE.DEBUG
    );
  }

  static warn(functionName, message, payload = {}, devAlias = "") {
    if (Config.IS_CONSOLE_LOG !== "true") return;
    LHTLogger.log(
      functionName,
      message,
      payload,
      devAlias,
      httpConstants.LOG_LEVEL_TYPE.WARN
    );
  }

  static error(functionName, message, payload = {}, devAlias = "") {
    LHTLogger.log(
      functionName,
      message,
      payload,
      devAlias,
      httpConstants.LOG_LEVEL_TYPE.ERROR
    );
  }

  static log(functionName, message, payload, devAlias, logType) {
    const logString = `[${Utils.getFormattedDate()}] ${logType}: ${functionName}: ${message}: ${JSON.stringify(
      payload
    )}: Developer : ${devAlias}`;
    switch (logType) {
      case httpConstants.LOG_LEVEL_TYPE.WARN:
        console.warn(logString);
        break;
      case httpConstants.LOG_LEVEL_TYPE.DEBUG:
        console.debug(logString);
        break;
      case httpConstants.LOG_LEVEL_TYPE.ERROR:
        console.error(logString);
        break;
      default:
        console.log(logString);
    }
  }
}
