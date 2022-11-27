import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Stack from '../lib/s3-with-ddb';

test('Bucket Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Stack.S3WithDDBStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::S3::Bucket', 1);
});
