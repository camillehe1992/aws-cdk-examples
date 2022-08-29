import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
interface StaticSiteS3CdkProps extends StackProps {
    bucketName: string;
}
export declare class StaticSiteS3CdkStack extends Stack {
    constructor(scope: Construct, id: string, props?: StaticSiteS3CdkProps);
}
export {};
