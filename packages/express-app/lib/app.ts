import { Server } from "@overnightjs/core";
import { Application } from "express";

import { HelloWorldController } from "./controllers";

/**
 * Blog API Express App
 */
export class App {
  static createApp(): Application {
    const server = new Server();
    const app = server.app;
    server.addControllers(new HelloWorldController());
    return app;
  }
}
