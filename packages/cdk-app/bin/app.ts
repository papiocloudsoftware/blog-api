#!/usr/bin/env node

import { App } from "@aws-cdk/core";

import { BlogApiApp } from "../lib/BlogApiApp";

const app = new App();
BlogApiApp.populate(app);
app.synth();
