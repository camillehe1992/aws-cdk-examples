import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cwlogs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface S3WithDDBStackProps extends StackProps {
  bucketName: string,
  lambdaName: string,
  tableName: string,
  roleName: string
}

export class S3WithDDBStack extends Stack {
  constructor(scope: Construct, id: string, props?: S3WithDDBStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      bucketName: props?.bucketName
    });

    const table = new dynamodb.Table(this, 'Table', {
      tableName: props?.tableName,
      partitionKey: {
        name: 'eTag',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      readCapacity: 1,
      writeCapacity: 1
    });

    const role = new iam.Role(this, 'ExecutionRole', {
      roleName: props?.roleName,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaExecute"));

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'dynamodb:PutItem'
        ],
        resources: ['*'],
        effect: iam.Effect.ALLOW
    }));

    const fn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(`${__dirname}/s3-event-processor`, {}),
      memorySize: 128,
      functionName: props?.lambdaName,
      logRetention: cwlogs.RetentionDays.TWO_WEEKS,
      role,
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    fn.addEventSource(new eventsources.S3EventSource(bucket, {
      events: [ 
        s3.EventType.OBJECT_CREATED,
        s3.EventType.OBJECT_REMOVED
      ]
    }));
  }
}
