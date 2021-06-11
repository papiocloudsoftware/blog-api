import { App } from "@papiocloudsoftware/blog-api-express-app/lib/app";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import * as http from "http";

let server: http.Server | undefined = undefined;

/**
 * Blog API entrypoint lambda
 *
 * @param {APIGatewayProxyEvent} event - the Lambda event object
 * @param {Context} context - the lambda invocation context
 * @returns {Promise<APIGatewayProxyResult>} the API response
 */
export async function handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  const app = App.createApp();
  if (!server) {
    server = createServer(app);
    process.on("exit", () => {
      server?.close();
      server = undefined;
    });
  }
  return proxy(server, event, context, "PROMISE").promise;
}
