import { handleIndex } from "./routes/main.route";
import { wss } from "./servers/ws";
import { initHttpServer, registerRouters } from "./servers/www";
import messagerRoute from "./routes/messager.route";

initHttpServer(3000, "localhost", wss);
registerRouters(function (app, wss) {
  messagerRoute.setSocketServer(wss);

  app.get("/", (req, res) => handleIndex(req, res, wss));
  app.use("/messager", messagerRoute.router);
});
