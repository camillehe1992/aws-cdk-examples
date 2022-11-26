#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { TemplateAppStack } from '../lib/template-app-stack';

const env = {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION
}

const app = new cdk.App();
new TemplateAppStack(app, 'TemplateAppStack', { env });
