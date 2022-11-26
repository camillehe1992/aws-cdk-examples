import { Duration, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cwlogs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

interface KinesisStreamingCdkProps extends StackProps {
  kdsName: string,
  kmsAlias: string
}

export class KinesisStreamingStack extends Stack {
  constructor(scope: Construct, id: string, props?: KinesisStreamingCdkProps) {
    super(scope, id, props);

    const stack = Stack.of(this);

    const key = new kms.Key(this, 'MyKey', {
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

    key.addAlias(props?.kmsAlias || 'kinesis-data-stream-encryption');

    const stream = new kinesis.Stream(this, 'MyEncryptedStream', {
      encryption: kinesis.StreamEncryption.KMS,
      encryptionKey: key,
      retentionPeriod: Duration.hours(24),
      streamMode: kinesis.StreamMode.ON_DEMAND,
      streamName: props?.kdsName
    });

    const fn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(`${__dirname}/records-process-fn-code`, {}),
      memorySize: 128,
      functionName: `${id}-${stack.stackName}`,
      logRetention: cwlogs.RetentionDays.TWO_WEEKS
    });

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'kinesis:Get*'
        ],
        resources: ['*'],
        effect: iam.Effect.ALLOW
    }));

    fn.addEventSource(new KinesisEventSource(stream, {
      batchSize: 100, // default
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    }));
  }
}
