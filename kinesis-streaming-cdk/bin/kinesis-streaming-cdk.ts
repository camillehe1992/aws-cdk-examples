#!/usr/bin/env node
import 'dotenv/config'
import * as cdk from 'aws-cdk-lib';
import { KinesisStreamingStack } from '../lib/kinesis-streaming-stack';

const env = { 
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
}

const app = new cdk.App();

cdk.Tags.of(app).add('Project', 'kinesis-streaming-cdk');

new KinesisStreamingStack(app, 'KinesisStreamingStack', { 
  kdsName: 'stailer-ordering-stream',
  kmsAlias: 'stailer-ordering-stream-kms-key',
  env 
});
