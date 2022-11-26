import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
interface KinesisStreamingCdkProps extends StackProps {
    kdsName: string;
    kmsAlias: string;
}
export declare class KinesisStreamingStack extends Stack {
    constructor(scope: Construct, id: string, props?: KinesisStreamingCdkProps);
}
export {};
