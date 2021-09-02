import { DomainName, HttpApi, HttpApiMapping, HttpStage, IDomainName } from "@aws-cdk/aws-apigatewayv2";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2/lib/http/route";
import { Construct, Duration, Stack, StackProps } from "@aws-cdk/core";
import { SharedCertificate } from "@papio/cdk-constructs";

import { BlogApiApp } from "../BlogApiApp";

/**
 * Props required to create {NetworkingStack}
 */
export interface NetworkingStackProps extends StackProps {
  readonly domainName: string;
}

/**
 * Stack that contains all the networking resources for the API
 */
export class NetworkingStack extends Stack {
  readonly httpApi: HttpApi;
  readonly httpStage: HttpStage;
  readonly domain: IDomainName;

  constructor(scope: Construct, id: string, props: NetworkingStackProps) {
    super(scope, id, props);

    this.httpApi = new HttpApi(this, "Api", {
      apiName: `BlogApi${BlogApiApp.APP_SUFFIX}`,
      createDefaultStage: false,
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE],
        maxAge: Duration.days(1)
      }
    });

    this.httpStage = new HttpStage(this, "Stage", {
      httpApi: this.httpApi,
      stageName: "api"
    });

    const certificate = new SharedCertificate(this, "Certificate", {
      certificateDomain: props.domainName
    });
    this.domain = new DomainName(this, "DomainName", {
      domainName: props.domainName,
      certificate
    });

    const mapping = new HttpApiMapping(this, "DomainNameMapping", {
      api: this.httpApi,
      stage: this.httpStage,
      domainName: this.domain
    });
    mapping.node.addDependency(this.domain);
  }
}
