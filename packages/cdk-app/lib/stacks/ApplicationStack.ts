import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey, PayloadFormatVersion } from "@aws-cdk/aws-apigatewayv2";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";
import * as lambda from "@aws-cdk/aws-lambda";
import { Code, Runtime } from "@aws-cdk/aws-lambda";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import * as path from "path";

/**
 * Props required to create {ApplicationStack}
 */
export interface ApplicationStackProps extends StackProps {
  readonly httpApi: HttpApi;
}

/**
 * Stack that contains all the API resources
 */
export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    const httpApiRef = HttpApi.fromHttpApiAttributes(this, "HttpApi", {
      httpApiId: props.httpApi.httpApiId,
      apiEndpoint: props.httpApi.apiEndpoint
    });

    const lambdaHandler = new lambda.Function(this, "Lambda", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(path.resolve(__dirname, "..", "lambdas")),
      handler: "api-handler.handle"
    });

    new HttpRoute(this, "ProxyRoute", {
      httpApi: httpApiRef,
      routeKey: HttpRouteKey.with("/{proxy+}", HttpMethod.GET),
      integration: new LambdaProxyIntegration({
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
        handler: lambdaHandler
      })
    });
  }
}
