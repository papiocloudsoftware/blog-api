import { Server } from "@overnightjs/core";
import { Application } from "express";

import { BlogApiController } from "./controllers";

/**
 * Blog API Express App
 */
export class App {
  static createApp(): Application {
    const server = new Server();
    const app = server.app;
    server.addControllers(new BlogApiController());
    return app;
  }
}
