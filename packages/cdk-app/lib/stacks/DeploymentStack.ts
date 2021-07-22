import { HttpApi, HttpStage, IHttpStage } from "@aws-cdk/aws-apigatewayv2";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

/**
 * Props required to create {DeploymentStack}
 */
export interface DeploymentStackProps extends StackProps {
  readonly httpApi: HttpApi;
}

/**
 * Stack that triggers the deployment of the API
 */
export class DeploymentStack extends Stack {
  readonly stage: IHttpStage;

  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    // We separate out stage from resources on API to ensure all API resources have been fully updated before we cut over.
    this.stage = new HttpStage(this, "Stage", {
      httpApi: props?.httpApi,
      stageName: "api",
      autoDeploy: true
    });
  }
}
