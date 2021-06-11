import { Construct, Stack, StackProps } from "@aws-cdk/core";

/**
 * Props required to create {ApplicationStack}
 */
export interface ApplicationStackProps extends StackProps {}

/**
 * Stack that contains all the networking resources for the API
 */
export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApplicationStackProps) {
    super(scope, id, props);
  }
}
