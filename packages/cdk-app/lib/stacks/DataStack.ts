import { AttributeType, ITable, Table } from "@aws-cdk/aws-dynamodb";
import { Bucket, BucketAccessControl, IBucket } from "@aws-cdk/aws-s3";
import { Construct, Stack, StackProps } from "@aws-cdk/core";

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
      autoDeleteObjects: true,
      accessControl: BucketAccessControl.PRIVATE
    });
  }
}
