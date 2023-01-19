///----------Nodule IMPORTS--------------------///
import StringModule from "../app/modules/string";

///-------------Constants Imports---------------------///
import { stringConstants } from "../app/common/constants";

///-----------Validation MiddleWre Imports----------------///
import * as ValidationManager from "../middleware/validation";

module.exports = (app) => {
  /**
   * Service checking endpoint
   */
  app.get("/", (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

  /**
   *  Strings APIs
   */
  app.get(
    "/get-text-suggestions",
    ValidationManager.validateURL,
    new StringModule().getTextSuggestions
  );
};
