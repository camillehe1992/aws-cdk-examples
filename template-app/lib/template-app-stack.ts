import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

interface TemplateAppStackProps extends StackProps {
  bucketName: string;
}

export class TemplateAppStack extends Stack {
  public readonly s3Bcuket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: TemplateAppStackProps) {
    super(scope, id, props);

    // define the bucket
    const s3Bucket = new s3.Bucket(this, "Bucket", {
      bucketName: props?.bucketName,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // create an Output
    new CfnOutput(this, "BucketName", {
      value: s3Bucket.bucketName,
      description: "The name of the s3 bucket",
      exportName: "avatarsBucket",
    });
  }
}
