import express from 'express';
import { WebSocketServer } from 'ws';
import * as core from 'express-serve-static-core';
const app = express();
const app_port = 3000;
var _wss: WebSocketServer;

export function initHttpServer(port: number, address: string, wss: WebSocketServer) {
    _wss = wss;
    app.listen(app_port);
    return app;
}

export function registerRoutes(callback: (app: core.Express, wss: WebSocketServer) => any) : void {
    callback(app, _wss);
}