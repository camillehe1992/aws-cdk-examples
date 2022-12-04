#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { OpenSearchStack } from '../lib/opensearch';

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION
}

const app = new cdk.App();
new OpenSearchStack(app, 'OpenSearchStack', { env });
