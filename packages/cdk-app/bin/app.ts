#!/usr/bin/env node

import { App } from "@aws-cdk/core";

import { BlogApiApp } from "../lib/BlogApiApp";

const app = new App();
const host = app.node.tryGetContext("host") ?? "blog";
const domain = app.node.tryGetContext("domain") ?? "papiocloud.com";

BlogApiApp.populate(app, { domainName: `${host}${BlogApiApp.DASH_APP_SUFFIX}.${domain}` });
app.synth();
