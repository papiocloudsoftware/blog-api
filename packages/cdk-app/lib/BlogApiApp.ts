import { App, CfnCondition, CfnParameter, Fn, Stack } from "@aws-cdk/core";
import { pascalCase } from "change-case";

import { ApplicationStack, DataStack, DeploymentStack, NetworkingStack } from "./stacks";

/**
 * Properties for the API app
 */
export interface BlogApiAppProps {
  readonly domainName?: string;
}

/**
 * Blog API CDK App.  Populates resources given a CDK App
 */
export class BlogApiApp {
  static readonly APP_SUFFIX = Fn.ref("AppSuffix");
  static readonly DASH_APP_SUFFIX = Fn.conditionIf("AppSuffixSet", `-${BlogApiApp.APP_SUFFIX}`, "").toString();

  static populate(app: App, props?: BlogApiAppProps): void {
    const env = app.node.tryGetContext("environmentName");
    const stackSuffix = env ? pascalCase(env) : "";

    const networkingStack = new NetworkingStack(app, `BlogApi${stackSuffix}Networking`, {
      domainName: props?.domainName
    });
    const dataStack = new DataStack(app, `BlogApi${stackSuffix}Data`);
    const appStack = new ApplicationStack(app, `BlogApi${stackSuffix}Application`, {
      httpApi: networkingStack.httpApi,
      metadataTable: dataStack.metadataTable,
      contentBucket: dataStack.contentBucket
    });
    const deployStack = new DeploymentStack(app, `BlogApi${stackSuffix}Deployment`, {
      httpApi: networkingStack.httpApi,
      httpStage: networkingStack.httpStage,
      domainName: networkingStack.domain,
      deploymentKey: appStack.assetHash.substr(0, 6)
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
