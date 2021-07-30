import { HttpApi } from "@aws-cdk/aws-apigatewayv2";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

import { BlogApiApp } from "../BlogApiApp";

/**
 * Props required to create {NetworkingStack}
 */
export interface NetworkingStackProps extends StackProps {}

/**
 * Stack that contains all the networking resources for the API
 */
export class NetworkingStack extends Stack {
  readonly httpApi: HttpApi;

  constructor(scope: Construct, id: string, props?: NetworkingStackProps) {
    super(scope, id, props);

    this.httpApi = new HttpApi(this, "Api", {
      apiName: `BlogApi${BlogApiApp.APP_SUFFIX}`,
      createDefaultStage: false
    });
  }
}
