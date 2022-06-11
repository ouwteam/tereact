import 'dotenv/config';
import { handleIndex } from "./routes/main.route";
import { wss } from "./servers/ws";
import { initHttpServer, registerRouters } from "./servers/www";
import messagerRoute from "./routes/messager.route";
import { env } from "./utils/helper";

initHttpServer(parseInt(env("APP_PORT")), "localhost", wss);
registerRouters(function (app, wss) {
  messagerRoute.setSocketServer(wss);

  app.get("/", (req, res) => handleIndex(req, res, wss));
  app.use("/messager", messagerRoute.router);
});

console.log("HTTP server at port", env("APP_PORT"));
console.log("registered client:", wss.clients.size);
