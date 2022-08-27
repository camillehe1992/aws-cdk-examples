#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ThreeTiersNetworkCdkStack } from '../lib/three-tiers-network-cdk-stack';

import conf from '../config';

const env = { 
  account: conf.account,
  region: conf.region,
}

const app = new cdk.App();

cdk.Tags.of(app).add('Project', 'three-tiers-network-cdk');

new ThreeTiersNetworkCdkStack(app, 'ThreeTiersNetworkCdkStack', { env });
