import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as crypto from "crypto";

import { AppConfig } from "../config";
import { Subscriber } from "../model/data";

/**
 * Service for interacting with blog subscriptions
 */
export class SubscriberService {
  readonly config: AppConfig;
  readonly sesClient: AWS.SES;
  readonly dynamoClient: DocumentClient;

  constructor(config = AppConfig.fromEnvironment(), dynamoClient = new DocumentClient(), sesClient = new AWS.SES()) {
    this.config = config;
    this.sesClient = sesClient;
    this.dynamoClient = dynamoClient;
  }

  private get tableName() {
    return this.config.subscribersTable;
  }

  private get domainName() {
    return this.config.domainName;
  }

  async findSubscriberById(id: string): Promise<undefined | Subscriber> {
    const response = await this.dynamoClient
      .get({
        TableName: this.tableName,
        Key: { id }
      })
      .promise();
    return response.Item as Subscriber;
  }

  async findSubscriberByEmail(email: string): Promise<undefined | Subscriber> {
    const response = await this.dynamoClient
      .query({
        TableName: this.tableName,
        IndexName: "Email",
        KeyConditionExpression: `email = :email`,
        ExpressionAttributeValues: {
          ":email": email
        },
        Limit: 1
      })
      .promise();
    if (response.Items?.length === 1) {
      return response.Items[0] as Subscriber;
    }
    return undefined;
  }

  async subscribe(email: string): Promise<void> {
    let subscriber = await this.findSubscriberByEmail(email);
    if (!subscriber?.validated) {
      if (!subscriber) {
        subscriber = {
          id: await this.generateId(email),
          email,
          validated: false
        };
        await this.save(subscriber);
      }
      await this.sendValidationEmail(subscriber);
    }
  }

  async unsubscribe(id: string): Promise<void> {
    const subscriber = await this.findSubscriberById(id);
    if (subscriber) {
      await this.dynamoClient
        .delete({
          TableName: this.tableName,
          Key: { id }
        })
        .promise();
      await this.sendUnsubscribeEmail(subscriber);
    }
  }

  async confirm(id: string): Promise<boolean> {
    const subscriber = await this.findSubscriberById(id);
    if (!subscriber) {
      return false;
    }
    if (!subscriber.validated) {
      await this.save({
        ...subscriber,
        validated: true
      });
    }
    return true;
  }

  async sendValidationEmail(subscriber: Subscriber): Promise<void> {
    await this.sendEmail(
      subscriber.email,
      "Confirm Subscription",
      `
<html>
  <body>
    <form method="POST" action="https://${this.domainName}/api/subscribers/${subscriber.id}/confirm">
      <button type="submit">Confirm</button>
    </form>
  </body>
</html>
    `.trim()
    );
  }

  async sendUnsubscribeEmail(subscriber: Subscriber): Promise<void> {
    await this.sendEmail(
      subscriber.email,
      "You've Been Unsubscribed",
      `
<html>
  <body>
    <p>Sorry to see you go!</p>
  </body>
</html>
    `.trim()
    );
  }

  private async sendEmail(email: string, subject: string, body: string): Promise<void> {
    const domainParts = this.domainName.split(".");
    const emailDomain = domainParts.slice(-2).join(".");
    const request: AWS.SES.SendEmailRequest = {
      Source: `no-reply@${emailDomain}`,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: body } }
      }
    };
    await this.sesClient.sendEmail(request).promise();
  }

  private async save(subscriber: Subscriber): Promise<void> {
    await this.dynamoClient
      .put({
        TableName: this.tableName,
        Item: subscriber
      })
      .promise();
  }

  private async generateId(email: string): Promise<string> {
    let attempt = 0;
    while (attempt < 5) {
      attempt += 1;
      const id = crypto.createHash("sha256").update(email).update(new Date().toISOString()).digest("hex").substr(0, 24);
      const existing = this.findSubscriberById(id);
      if (!existing) {
        return id;
      }
    }
    throw new Error(`Unable to generate unique id for ${email} in 5 attempts`);
  }
}
