#!/usr/bin/env node
import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { TemplateAppStack } from "../lib/template-app-stack";

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
};

const app = new cdk.App();

cdk.Tags.of(app).add("Project", "template-app-stack");

new TemplateAppStack(app, "TemplateAppStack", {
  bucketName: `avator-bucket-${env.account}-${env.region}`,
  env,
});
