import { Application } from "express";
import * as request from "supertest";

import { App } from "../lib/app";

describe("app", () => {
  let app: Application;

  beforeEach(() => {
    app = App.createApp();
  });

  it("will return hello message on /api/hello", async () => {
    const res = await request(app).get("/api/hello");
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ message: "Hello, World!" });
  });
});
