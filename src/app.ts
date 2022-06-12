import 'dotenv/config';
import { handleIndex } from "./routes/main.route";
import { wss } from "./servers/ws";
import { initHttpServer, registerRouters } from "./servers/www";
import messagerRoute from "./routes/messager.route";
import userRoute from "./routes/user.route";
import roomRoute from "./routes/room.route";
import { env } from "./utils/helper";
import sequelize from './servers/database';

initHttpServer(parseInt(env("APP_PORT")), "localhost", wss);
registerRouters(function (app, wss) {
  messagerRoute.setSocketServer(wss);

  app.get("/", (req, res) => handleIndex(req, res, wss));
  app.use("/messager", messagerRoute.router);
  app.use("/user", userRoute.router);
  app.use("/room", roomRoute.router);
});

console.log("HTTP server at port", env("APP_PORT"));
console.log("registered client:", wss.clients.size);
