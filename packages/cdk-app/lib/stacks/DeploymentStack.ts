import { CfnDeployment, HttpApi, HttpStage } from "@aws-cdk/aws-apigatewayv2";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

/**
 * Props required to create {DeploymentStack}
 */
export interface DeploymentStackProps extends StackProps {
  readonly httpApi: HttpApi;
  readonly httpStage: HttpStage;
  readonly deploymentKey: string;
  readonly domainName?: string;
}

/**
 * Stack that triggers the deployment of the API
 */
export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    new CfnDeployment(this, `Deployment${props.deploymentKey}`, {
      apiId: props.httpApi.httpApiId,
      stageName: props.httpStage.stageName
    });

    if (props.domainName) {
      // // Cut over DNS
      // const hostedZone = new HostedZoneLookup(this, "HostedZone", {
      //   domainName: props.domainName
      // });
      // new AliasRecord(this, "AliasRecord", {
      //   zone: hostedZone,
      //   recordName: `${props.domainName}.`,
      //   target: RecordTarget.fromAlias(new ApiGatewayv2Domain(apiDomain)),
      //   comment: "Record for Public Cloudfront distribution"
      // });
    }
  }
}
