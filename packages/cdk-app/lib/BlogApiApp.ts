import { App } from "@aws-cdk/core";
import { pascalCase } from "change-case";

import { ApplicationStack, DataStack, DeploymentStack, NetworkingStack } from "./stacks";

/**
 * Blog API CDK App.  Populates resources given a CDK App
 */
export class BlogApiApp {
  static populate(app: App): void {
    const env = app.node.tryGetContext("environmentName");
    const stackSuffix = env ? pascalCase(env) : "";

    new NetworkingStack(app, `BlogApi${stackSuffix}Networking`);
    new DataStack(app, `BlogApi${stackSuffix}Data`);
    new ApplicationStack(app, `BlogApi${stackSuffix}Application`);
    new DeploymentStack(app, `BlogApi${stackSuffix}Deployment`);
  }
}
