# AWS CDK Examples

This repo provides a variety of examples to setup AWS infrastructure using AWS CDK.

## Prerequisites

1. AWS Account.
2. You have to have the [CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) installed and the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured.
3. Make sure your current AWS credential has access to create stacks in your AWS account.
4. Your account should be boostrapped by `cdk boostrap`.

## CDK Projects

| Project                                               | Use case                                                                 | Keywords                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------- |
| [three-tiers-network-cdk](./three-tiers-network-cdk/) | Create a VPC with internet access and a three tiers network archtecture. | VPC, Network                 |
| [amplify-app-cdk](./amplify-app-cdk/)                 | Deploy a Static Website (Vue) with AWS Amplify and CDK                   | Amplify, Vue, Secret Manager |
| [static-site-s3-cdk](./static-site-s3-cdk/)           | Deploy a Static Website (docsify) with AWS S3 and CloudFront             | S3, CloudFront               |
| [kinesis-streaming-cdk](./kinesis-streaming-cdk/)     | Create a Kinesis Data Stream that integrates with Lambda function        | Kinesis Data Stream, Lambda  |
