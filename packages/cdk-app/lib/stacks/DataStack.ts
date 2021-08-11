import { AttributeType, ITable, Table } from "@aws-cdk/aws-dynamodb";
import { AccountRootPrincipal, Role } from "@aws-cdk/aws-iam";
import { Bucket, BucketAccessControl, IBucket } from "@aws-cdk/aws-s3";
import { Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";

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
  readonly contentBucket: IBucket;

  constructor(scope: Construct, id: string, props?: DataStackProps) {
    super(scope, id, props);

    this.metadataTable = new Table(this, "BlogMetadata", {
      partitionKey: {
        type: AttributeType.STRING,
        name: "id"
      }
    });

    this.contentBucket = new Bucket(this, "BlogContent", {
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
  }
}
