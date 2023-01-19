import APP from "express";
import routes from "./routes";
import Config from "./config";
import LhtLogger from "./app/utils/logger";
import HTTPHandler from "./app/utils/HTTPHandler";

const app = new APP();
require("./config/express")(app);

global.lhtWebLog = LhtLogger;
global.httpResponse = HTTPHandler;

class Server {
  static listen() {
    app
      .listen(Config.PORT, () => {
        lhtWebLog.info("Server:listen", `Server Started on ${Config.PORT}`);
        routes(app);
      })
      .on("error", (error) => {
        lhtWebLog.error("Server:listen", "failed to connect", { err: error });
      });
  }
}
Server.listen();
