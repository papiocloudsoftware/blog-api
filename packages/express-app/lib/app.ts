import { Server } from "@overnightjs/core";
import * as cors from "cors";
import { Application, json } from "express";

import { BlogApiController, SubscriptionController } from "./controllers";

/**
 * Blog API Express App
 */
export class App {
  static createApp(): Application {
    const server = new Server();
    const app = server.app;
    app.use(cors());
    app.use(json());
    server.addControllers(new BlogApiController());
    server.addControllers(new SubscriptionController());
    return app;
  }
}
