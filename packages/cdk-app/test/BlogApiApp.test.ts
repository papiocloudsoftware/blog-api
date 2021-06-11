import { App } from "@aws-cdk/core";

import { BlogApiApp } from "../lib/BlogApiApp";
import { ApplicationStack, DataStack, DeploymentStack, NetworkingStack } from "../lib/stacks";

describe("BlogApiApp", () => {
  it("will create four stacks", () => {
    const app = new App();
    BlogApiApp.populate(app);

    expect(app.node.tryFindChild("BlogApiNetworking")).toBeInstanceOf(NetworkingStack);
    expect(app.node.tryFindChild("BlogApiData")).toBeInstanceOf(DataStack);
    expect(app.node.tryFindChild("BlogApiApplication")).toBeInstanceOf(ApplicationStack);
    expect(app.node.tryFindChild("BlogApiDeployment")).toBeInstanceOf(DeploymentStack);
  });

  it("will use context, if provided, to name stacks", () => {
    const app = new App({
      context: { environmentName: "test" }
    });

    BlogApiApp.populate(app);

    expect(app.node.tryFindChild("BlogApiTestNetworking")).toBeInstanceOf(NetworkingStack);
    expect(app.node.tryFindChild("BlogApiTestData")).toBeInstanceOf(DataStack);
    expect(app.node.tryFindChild("BlogApiTestApplication")).toBeInstanceOf(ApplicationStack);
    expect(app.node.tryFindChild("BlogApiTestDeployment")).toBeInstanceOf(DeploymentStack);
  });
});
