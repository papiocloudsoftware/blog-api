import { App, CfnCondition, CfnParameter, Fn, Stack } from "@aws-cdk/core";
import { pascalCase } from "change-case";

import { ApplicationStack, DataStack, DeploymentStack, NetworkingStack } from "./stacks";

/**
 * Blog API CDK App.  Populates resources given a CDK App
 */
export class BlogApiApp {
  static readonly APP_SUFFIX = Fn.ref("AppSuffix");
  static readonly DASH_APP_SUFFIX = Fn.conditionIf("AppSuffixSet", `-${BlogApiApp.APP_SUFFIX}`, "").toString();
  static readonly DOMAIN_NAME = `blog${BlogApiApp.DASH_APP_SUFFIX}.papiocloud.com`;

  static populate(app: App): void {
    const env = app.node.tryGetContext("environmentName");
    const stackSuffix = env ? pascalCase(env) : "";

    const networkingStack = new NetworkingStack(app, `BlogApi${stackSuffix}Networking`, {
      domainName: BlogApiApp.DOMAIN_NAME
    });
    const dataStack = new DataStack(app, `BlogApi${stackSuffix}Data`);
    const appStack = new ApplicationStack(app, `BlogApi${stackSuffix}Application`, {
      httpApi: networkingStack.httpApi
    });
    const deployStack = new DeploymentStack(app, `BlogApi${stackSuffix}Deployment`, {
      httpApi: networkingStack.httpApi,
      httpStage: networkingStack.httpStage,
      deploymentKey: appStack.assetHash.substr(0, 6),
      domainName: BlogApiApp.DOMAIN_NAME
    });

    appStack.addDependency(networkingStack);
    appStack.addDependency(dataStack);

    deployStack.addDependency(appStack);

    for (const child of app.node.children) {
      if (child instanceof Stack) {
        new CfnParameter(child, "AppSuffix", {
          type: "String",
          default: env ?? ""
        });
        new CfnCondition(child, "AppSuffixSet", {
          expression: Fn.conditionNot(Fn.conditionEquals(BlogApiApp.APP_SUFFIX, ""))
        });
      }
    }
  }
}
