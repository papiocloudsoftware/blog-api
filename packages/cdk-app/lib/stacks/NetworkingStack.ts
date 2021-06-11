import { Construct, Stack, StackProps } from "@aws-cdk/core";

/**
 * Props required to create {NetworkingStack}
 */
export interface NetworkingStackProps extends StackProps {}

/**
 * Stack that contains all the networking resources for the API
 */
export class NetworkingStack extends Stack {
  constructor(scope: Construct, id: string, props?: NetworkingStackProps) {
    super(scope, id, props);
  }
}
