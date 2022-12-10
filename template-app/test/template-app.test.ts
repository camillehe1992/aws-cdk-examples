import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as TemplateApp from "../lib/template-app-stack";

test("a S3 bucket is created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new TemplateApp.TemplateAppStack(app, "MyTestStack");
  // THEN

  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::S3::Bucket", 1);
});
