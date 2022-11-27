#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { S3WithDDBStack } from '../lib/s3-with-ddb';

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION
}

const identifier = 's3-with-ddb';
const app = new cdk.App();

new S3WithDDBStack(app, 'S3WithDDBStack', { 
  bucketName: `${identifier}-${env.account}-${env.region}`,
  lambdaName: `${identifier}-event-processor`,
  tableName: `${identifier}-table`,
  roleName: `${identifier}-lambda-execution-role`,
  env
 });
