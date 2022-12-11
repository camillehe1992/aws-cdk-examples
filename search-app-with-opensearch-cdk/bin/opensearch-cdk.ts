#!/usr/bin/env node
import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network";
import { OpenSearchStack } from "../lib/opensearch";

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
};

const app = new cdk.App();

cdk.Tags.of(app).add("Project", "search-app-with-opensearch-cdk");

const network = new NetworkStack(app, "NetworkStack", {
  vpcName: "OpenSearch-VPC",
  vpcCidr: "10.0.0.0/16",
  webTierSgName: "Web-Tier-SG",
  opensearchSgName: "OpenSearch-SG",
  env,
});

new OpenSearchStack(app, "OpenSearchStack", {
  vpc: network.vpc,
  webTierSg: network.webTierSg,
  opensearchTierSg: network.opensearchSg,
  lambdaName: "opensearch-client",
  domainName: "marvel-movies",
  env,
});
