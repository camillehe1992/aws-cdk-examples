#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TemplateAppStack } from '../lib/template-app-stack';

const app = new cdk.App();
new TemplateAppStack(app, 'TemplateAppStack');
