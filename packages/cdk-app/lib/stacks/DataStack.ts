import { AttributeType, BillingMode, ITable, Table } from "@aws-cdk/aws-dynamodb";
import { AccountRootPrincipal, Role } from "@aws-cdk/aws-iam";
import { Bucket, BucketAccessControl, IBucket } from "@aws-cdk/aws-s3";
import { Aws, CfnOutput, Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";

import { BlogApiApp } from "../BlogApiApp";

/**
 * Props required to create {DataStack}
 */
export interface DataStackProps extends StackProps {}

/**
 * Stack that contains all the networking resources for the API
 */
export class DataStack extends Stack {
  readonly metadataTable: ITable;
  readonly subscriptionsTable: ITable;
  readonly contentBucket: IBucket;

  constructor(scope: Construct, id: string, props?: DataStackProps) {
    super(scope, id, props);

    this.metadataTable = new Table(this, "BlogMetadataV2", {
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: Aws.STACK_NAME,
      partitionKey: {
        type: AttributeType.STRING,
        name: "id"
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const subscriptionsTable = new Table(this, "BlogSubscriptionsV2", {
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: `${Aws.STACK_NAME}Subscriptions`,
      partitionKey: {
        type: AttributeType.STRING,
        name: "id"
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    subscriptionsTable.addGlobalSecondaryIndex({
      indexName: "Email",
      partitionKey: {
        type: AttributeType.STRING,
        name: "email"
      }
    });
    this.subscriptionsTable = subscriptionsTable;

    this.contentBucket = new Bucket(this, "BlogContentV2", {
      bucketName: `blog-api-data${BlogApiApp.DASH_APP_SUFFIX}-${Aws.ACCOUNT_ID}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      accessControl: BucketAccessControl.PRIVATE
    });

    const publishRole = new Role(this, "BlogPublisherRole", {
      roleName: `BlogPublisher${BlogApiApp.APP_SUFFIX}`,
      assumedBy: new AccountRootPrincipal()
    });
    this.metadataTable.grantReadWriteData(publishRole);
    this.contentBucket.grantReadWrite(publishRole);

    // Legacy CFN output no longer needed in application stack, remove after deploy
    new CfnOutput(this, "ExportsOutputRefBlogContentV259A5C64E68B981C0", {
      value: this.contentBucket.bucketName,
      exportName: `${Aws.STACK_NAME}:ExportsOutputRefBlogContentV259A5C64E68B981C0`
    });
  }
}
