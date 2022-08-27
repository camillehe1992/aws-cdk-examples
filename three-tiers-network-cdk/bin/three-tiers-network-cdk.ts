#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ThreeTiersNetworkCdkStack } from '../lib/three-tiers-network-cdk-stack';

const app = new cdk.App();
new ThreeTiersNetworkCdkStack(app, 'ThreeTiersNetworkCdkStack');
