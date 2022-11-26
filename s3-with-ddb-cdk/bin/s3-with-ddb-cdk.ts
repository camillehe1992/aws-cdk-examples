#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { S3WithDDBStack } from '../lib/s3-with-ddb';

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION
}

const app = new cdk.App();
new S3WithDDBStack(app, 'S3WithDDBStack', { env });
