import { wss } from "./servers/ws";
import { initHttpServer, registerRoutes } from "./servers/www";

initHttpServer(3000, "localhost", wss);
registerRoutes(function (app, wss) {
  app.get("/", (req, res) => {
    res.send({
      online_user: wss.clients.size,
      ws_address: wss.address(),
      httpVersion: req.httpVersion,
    });
  });
});
