import { CfnDeployment, DomainName, HttpApi, HttpStage, IDomainName } from "@aws-cdk/aws-apigatewayv2";
import { RecordTarget } from "@aws-cdk/aws-route53";
import { ApiGatewayv2Domain } from "@aws-cdk/aws-route53-targets";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { AliasRecord, HostedZoneLookup } from "@papio/cdk-constructs";

/**
 * Props required to create {DeploymentStack}
 */
export interface DeploymentStackProps extends StackProps {
  readonly httpApi: HttpApi;
  readonly httpStage: HttpStage;
  readonly deploymentKey: string;
  readonly domainName?: IDomainName;
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
      // Cut over DNS
      const hostedZone = new HostedZoneLookup(this, "HostedZone", {
        domainName: props.domainName.name
      });
      new AliasRecord(this, "AliasRecord", {
        zone: hostedZone,
        recordName: `${props.domainName}.`,
        target: RecordTarget.fromAlias(new ApiGatewayv2Domain(props.domainName)),
        comment: "Record for Public Cloudfront distribution"
      });
    }
  }
}
