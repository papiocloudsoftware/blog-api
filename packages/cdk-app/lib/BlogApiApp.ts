import { App, CfnCondition, CfnParameter, Fn, Stack } from "@aws-cdk/core";
import { pascalCase } from "change-case";

import { ApplicationStack, DataStack, DeploymentStack, NetworkingStack } from "./stacks";

/**
 * Blog API CDK App.  Populates resources given a CDK App
 */
export class BlogApiApp {
  static readonly APP_SUFFIX = Fn.ref("AppSuffix");
  static readonly DASH_APP_SUFFIX = Fn.conditionIf("AppSuffixSet", `-${BlogApiApp.APP_SUFFIX}`, "").toString();

  static populate(app: App): void {
    const env = app.node.tryGetContext("environmentName");
    const stackSuffix = env ? pascalCase(env) : "";

    const networking = new NetworkingStack(app, `BlogApi${stackSuffix}Networking`);
    new DataStack(app, `BlogApi${stackSuffix}Data`);
    new ApplicationStack(app, `BlogApi${stackSuffix}Application`, {
      httpApi: networking.httpApi
    });
    new DeploymentStack(app, `BlogApi${stackSuffix}Deployment`, {
      httpApi: networking.httpApi,
      domainName: `blog${BlogApiApp.DASH_APP_SUFFIX}.papiocloud.com`
    });

    for (const child of app.node.children) {
      if (child instanceof Stack) {
        new CfnParameter(child, "AppSuffix", {
          type: "String",
          default: stackSuffix
        });
        new CfnCondition(child, "AppSuffixSet", {
          expression: Fn.conditionNot(Fn.conditionEquals(BlogApiApp.APP_SUFFIX, ""))
        });
      }
    }
  }
}
