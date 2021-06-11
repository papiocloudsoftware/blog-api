import { Construct, Stack, StackProps } from "@aws-cdk/core";

/**
 * Props required to create {DeploymentStack}
 */
export interface DeploymentStackProps extends StackProps {}

/**
 * Stack that contains all the networking resources for the API
 */
export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: DeploymentStackProps) {
    super(scope, id, props);
  }
}
