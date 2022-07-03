import "dotenv/config";
import { handleIndex } from "./routes/main.route";
import { initHttpServer, registerRouters } from "./servers/www";
import messagerRoute from "./routes/messager.route";
import userRoute from "./routes/user.route";
import roomRoute from "./routes/room.route";
import contactRoute from "./routes/contact.route";
import { env } from "./utils/helper";

initHttpServer(parseInt(env("APP_PORT")), "0.0.0.0");
registerRouters(function (app, io) {
  messagerRoute.setSocketServer(io);

  app.get("/", (req, res) => handleIndex(req, res));
  app.use("/messenger", messagerRoute.router);
  app.use("/user", userRoute.router);
  app.use("/room", roomRoute.router);
  app.use("/contact", contactRoute.router);
});
