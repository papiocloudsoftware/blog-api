import { DomainName, HttpApi, HttpApiMapping, HttpStage, IHttpStage } from "@aws-cdk/aws-apigatewayv2";
import { RecordTarget } from "@aws-cdk/aws-route53";
import { ApiGatewayv2Domain } from "@aws-cdk/aws-route53-targets";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { AliasRecord, HostedZoneLookup, SharedCertificate } from "@papio/cdk-constructs";

/**
 * Props required to create {DeploymentStack}
 */
export interface DeploymentStackProps extends StackProps {
  readonly httpApi: HttpApi;
  readonly domainName?: string;
}

/**
 * Stack that triggers the deployment of the API
 */
export class DeploymentStack extends Stack {
  readonly stage: IHttpStage;

  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    const httpApiRef = HttpApi.fromHttpApiAttributes(this, "HttpApi", {
      httpApiId: props.httpApi.httpApiId,
      apiEndpoint: props.httpApi.apiEndpoint
    });

    // We separate out stage from resources on API to ensure all API resources have been fully updated before we cut over.
    this.stage = new HttpStage(this, "Stage", {
      httpApi: httpApiRef,
      stageName: "api",
      autoDeploy: true
    });

    if (props.domainName) {
      const certificate = new SharedCertificate(this, "Certificate", {
        certificateDomain: props.domainName
      });
      const apiDomain = new DomainName(this, "DomainName", {
        domainName: props.domainName,
        certificate
      });
      new HttpApiMapping(this, "DomainNameMapping", {
        api: props.httpApi,
        stage: this.stage,
        domainName: apiDomain
      });

      // Cut over DNS
      const hostedZone = new HostedZoneLookup(this, "HostedZone", {
        domainName: props.domainName
      });
      new AliasRecord(this, "AliasRecord", {
        zone: hostedZone,
        recordName: `${props.domainName}.`,
        target: RecordTarget.fromAlias(new ApiGatewayv2Domain(apiDomain)),
        comment: "Record for Public Cloudfront distribution"
      });
    }
  }
}
