#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSiteS3CdkStack } from '../lib/static-site-s3-cdk-stack';
import conf from '../config';

const env = {
  account: conf.account,
  region: conf.region
}

const app = new cdk.App();


new StaticSiteS3CdkStack(app, 'StaticSiteS3CdkStack', { 
  bucketName: `static-site-s3-${conf.account}-${conf.region}`,
  env
});
