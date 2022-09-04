import * as cdk from 'aws-cdk-lib';
// import { Template, Match } from 'aws-cdk-lib/assertions';
import * as Stack from '../lib/static-site-s3-cdk-stack';

test('Main Stacks Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Stack.StaticSiteS3CdkStack(app, 'StaticSiteS3CdkStack');
  // THEN

  // const template = Template.fromStack(stack);

  // template.hasResourceProperties('AWS::SQS::Queue', {
  //   VisibilityTimeout: 300
  // });
  // template.resourceCountIs('AWS::SNS::Topic', 1);
});
