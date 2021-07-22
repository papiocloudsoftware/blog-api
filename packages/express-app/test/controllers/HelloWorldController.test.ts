import { createRequest, createResponse } from "node-mocks-http";

import { HelloWorldController } from "../../lib/controllers";

describe("HelloWorldController", () => {
  it("will return a hello response", async () => {
    const req = createRequest();
    const res = createResponse();
    const controller = new HelloWorldController();
    controller.hello(req, res);
    expect(res._getJSONData()).toEqual({ message: "Hello, World!" });
  });
});
