#!/usr/bin/env node

import { App } from "@aws-cdk/core";
import * as path from "path";

import { BlogApiApp } from "../lib/BlogApiApp";

const app = new App();
const host = app.node.tryGetContext("host") ?? path.basename(process.cwd());
const domain = app.node.tryGetContext("domain") ?? "papiocloud.com";
let domainName: string | undefined = undefined;
if (host && domain) {
  domainName = `${host}${BlogApiApp.DASH_APP_SUFFIX}.${domainName}`;
}
BlogApiApp.populate(app, { domainName });
app.synth();
