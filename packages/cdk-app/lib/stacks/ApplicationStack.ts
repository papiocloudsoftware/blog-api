import { HttpApi, HttpMethod, HttpRoute, HttpRouteKey, PayloadFormatVersion } from "@aws-cdk/aws-apigatewayv2";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import { Code, Runtime } from "@aws-cdk/aws-lambda";
import { IBucket } from "@aws-cdk/aws-s3";
import { Asset } from "@aws-cdk/aws-s3-assets";
import { Construct, Duration, Stack, StackProps } from "@aws-cdk/core";
import * as path from "path";

/**
 * Props required to create {ApplicationStack}
 */
export interface ApplicationStackProps extends StackProps {
  readonly httpApi: HttpApi;
  readonly metadataTable: ITable;
  readonly contentBucket: IBucket;
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
      handler: "api-handler.handle",
      timeout: Duration.seconds(30),
      environment: {
        BLOG_TABLE: props.metadataTable.tableName
      }
    });

    props.contentBucket.grantRead(lambdaHandler);
    props.metadataTable.grantReadData(lambdaHandler);

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
