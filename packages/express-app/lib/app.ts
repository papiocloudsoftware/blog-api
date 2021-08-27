import { Server } from "@overnightjs/core";
import * as bodyParser from "body-parser";
import { Application } from "express";

import { BlogApiController, SubscriptionController } from "./controllers";

/**
 * Blog API Express App
 */
export class App {
  static createApp(): Application {
    const server = new Server();
    const app = server.app;
    app.use(bodyParser.urlencoded());
    server.addControllers(new BlogApiController());
    server.addControllers(new SubscriptionController());
    return app;
  }
}
