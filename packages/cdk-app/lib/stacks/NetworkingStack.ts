import { DomainName, HttpApi } from "@aws-cdk/aws-apigatewayv2";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { SharedCertificate } from "@papio/cdk-constructs";

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
  readonly domainName = `blog${BlogApiApp.DASH_APP_SUFFIX}.papiocloud.com`;

  constructor(scope: Construct, id: string, props?: NetworkingStackProps) {
    super(scope, id, props);

    this.httpApi = new HttpApi(this, "Api", {
      apiName: `BlogApi${BlogApiApp.APP_SUFFIX}`,
      createDefaultStage: false
    });

    const certificate = new SharedCertificate(this, "Certificate", {
      certificateDomain: this.domainName
    });
    new DomainName(this, "DomainName", {
      domainName: this.domainName,
      certificate
    });
  }
}
