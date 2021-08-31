import {
  HttpApi,
  HttpMethod,
  HttpRoute,
  HttpRouteKey,
  HttpStage,
  PayloadFormatVersion
} from "@aws-cdk/aws-apigatewayv2";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";
import { ITable } from "@aws-cdk/aws-dynamodb";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import { Code, Runtime } from "@aws-cdk/aws-lambda";
import { IBucket } from "@aws-cdk/aws-s3";
import { Aws, Construct, Duration, Stack, StackProps } from "@aws-cdk/core";
import * as path from "path";

/**
 * Props required to create {ApplicationStack}
 */
export interface ApplicationStackProps extends StackProps {
  readonly domainName: string;
  readonly httpApi: HttpApi;
  readonly metadataTable: ITable;
  readonly subscriptionsTable: ITable;
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
        DOMAIN_NAME: props.domainName,
        BLOG_TABLE: props.metadataTable.tableName,
        SUBSCRIBERS_TABLE: props.subscriptionsTable.tableName,
        // Responsibility of caller to populate create/secret outside app
        RECAPTCHA_SECRET_ID: `${Aws.STACK_NAME}RecaptchaSecretKey`
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["ses:SendEmail"],
          resources: ["*"]
        })
      ]
    });

    props.contentBucket.grantRead(lambdaHandler);
    props.metadataTable.grantReadData(lambdaHandler);
    props.subscriptionsTable.grantReadWriteData(lambdaHandler);

    for (const method of [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE]) {
      let id = "ProxyRoute";
      if (method !== HttpMethod.GET) {
        id = `${id}${method}`;
      }
      new HttpRoute(this, id, {
        httpApi: httpApiRef,
        routeKey: HttpRouteKey.with("/{proxy+}", method),
        integration: new LambdaProxyIntegration({
          payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
          handler: lambdaHandler
        })
      });
    }
  }
}
