import express from "express";
import { WebSocketServer } from "ws";
import * as core from "express-serve-static-core";
import bodyParser from "body-parser";

const app = express();
const app_port = 3000;
var _wss: WebSocketServer;

export function initHttpServer(port: number, address: string, wss: WebSocketServer) {
  _wss = wss;
  app.use(bodyParser.json());
  app.listen(app_port);
  return app;
}

export function registerRouters(callback: (app: core.Express, wss: WebSocketServer) => any): void {
  callback(app, _wss);
}
