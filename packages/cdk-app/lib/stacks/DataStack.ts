import { Construct, Stack, StackProps } from "@aws-cdk/core";

/**
 * Props required to create {DataStack}
 */
export interface DataStackProps extends StackProps {}

/**
 * Stack that contains all the networking resources for the API
 */
export class DataStack extends Stack {
  constructor(scope: Construct, id: string, props?: DataStackProps) {
    super(scope, id, props);
  }
}
