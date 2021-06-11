import { HelloWorldController } from "../../lib/controllers";

describe("HelloWorldController", () => {
  it("will return a hello response", async () => {
    const controller = new HelloWorldController();
    expect(controller.hello()).toEqual({ message: "Hello, World!" });
  });
});
