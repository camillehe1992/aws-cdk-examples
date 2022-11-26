"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisStreamingStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const kms = require("aws-cdk-lib/aws-kms");
const kinesis = require("aws-cdk-lib/aws-kinesis");
const lambda = require("aws-cdk-lib/aws-lambda");
const cwlogs = require("aws-cdk-lib/aws-logs");
const iam = require("aws-cdk-lib/aws-iam");
const aws_lambda_event_sources_1 = require("aws-cdk-lib/aws-lambda-event-sources");
class KinesisStreamingStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = aws_cdk_lib_1.Stack.of(this);
        const key = new kms.Key(this, 'MyKey', {
            enableKeyRotation: true,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY
        });
        key.addAlias((props === null || props === void 0 ? void 0 : props.kmsAlias) || 'kinesis-data-stream-encryption');
        const stream = new kinesis.Stream(this, 'MyEncryptedStream', {
            encryption: kinesis.StreamEncryption.KMS,
            encryptionKey: key,
            retentionPeriod: aws_cdk_lib_1.Duration.hours(24),
            streamMode: kinesis.StreamMode.ON_DEMAND,
            streamName: props === null || props === void 0 ? void 0 : props.kdsName
        });
        const fn = new lambda.Function(this, 'MyFunction', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(`${__dirname}/records-process-fn-code`, {}),
            memorySize: 128,
            functionName: `${id}-${stack.stackName}`,
            logRetention: cwlogs.RetentionDays.TWO_WEEKS
        });
        fn.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'kinesis:Get*'
            ],
            resources: ['*'],
            effect: iam.Effect.ALLOW
        }));
        fn.addEventSource(new aws_lambda_event_sources_1.KinesisEventSource(stream, {
            batchSize: 100,
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        }));
    }
}
exports.KinesisStreamingStack = KinesisStreamingStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1zdHJlYW1pbmctc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJraW5lc2lzLXN0cmVhbWluZy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBeUU7QUFDekUsMkNBQTJDO0FBQzNDLG1EQUFtRDtBQUNuRCxpREFBaUQ7QUFDakQsK0NBQStDO0FBQy9DLDJDQUEyQztBQUMzQyxtRkFBMEU7QUFRMUUsTUFBYSxxQkFBc0IsU0FBUSxtQkFBSztJQUM5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWdDO1FBQ3hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLG1CQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3JDLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQVEsS0FBSSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDM0QsVUFBVSxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHO1lBQ3hDLGFBQWEsRUFBRSxHQUFHO1lBQ2xCLGVBQWUsRUFBRSxzQkFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbkMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUztZQUN4QyxVQUFVLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU87U0FDM0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLDBCQUEwQixFQUFFLEVBQUUsQ0FBQztZQUN2RSxVQUFVLEVBQUUsR0FBRztZQUNmLFlBQVksRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ3hDLFlBQVksRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVM7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGVBQWUsQ0FDaEIsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE9BQU8sRUFBRTtnQkFDUCxjQUFjO2FBQ2Y7WUFDRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDaEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUMzQixDQUFDLENBQUMsQ0FBQztRQUVKLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSw2Q0FBa0IsQ0FBQyxNQUFNLEVBQUU7WUFDL0MsU0FBUyxFQUFFLEdBQUc7WUFDZCxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWTtTQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQTVDRCxzREE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2ssIFN0YWNrUHJvcHMsIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBraW5lc2lzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1raW5lc2lzJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGN3bG9ncyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBLaW5lc2lzRXZlbnRTb3VyY2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmludGVyZmFjZSBLaW5lc2lzU3RyZWFtaW5nQ2RrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAga2RzTmFtZTogc3RyaW5nLFxuICBrbXNBbGlhczogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBLaW5lc2lzU3RyZWFtaW5nU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogS2luZXNpc1N0cmVhbWluZ0Nka1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkodGhpcywgJ015S2V5Jywge1xuICAgICAgZW5hYmxlS2V5Um90YXRpb246IHRydWUsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICB9KTtcblxuICAgIGtleS5hZGRBbGlhcyhwcm9wcz8ua21zQWxpYXMgfHwgJ2tpbmVzaXMtZGF0YS1zdHJlYW0tZW5jcnlwdGlvbicpO1xuXG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IGtpbmVzaXMuU3RyZWFtKHRoaXMsICdNeUVuY3J5cHRlZFN0cmVhbScsIHtcbiAgICAgIGVuY3J5cHRpb246IGtpbmVzaXMuU3RyZWFtRW5jcnlwdGlvbi5LTVMsXG4gICAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gICAgICByZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLmhvdXJzKDI0KSxcbiAgICAgIHN0cmVhbU1vZGU6IGtpbmVzaXMuU3RyZWFtTW9kZS5PTl9ERU1BTkQsXG4gICAgICBzdHJlYW1OYW1lOiBwcm9wcz8ua2RzTmFtZVxuICAgIH0pO1xuXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdNeUZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYCR7X19kaXJuYW1lfS9yZWNvcmRzLXByb2Nlc3MtZm4tY29kZWAsIHt9KSxcbiAgICAgIG1lbW9yeVNpemU6IDEyOCxcbiAgICAgIGZ1bmN0aW9uTmFtZTogYCR7aWR9LSR7c3RhY2suc3RhY2tOYW1lfWAsXG4gICAgICBsb2dSZXRlbnRpb246IGN3bG9ncy5SZXRlbnRpb25EYXlzLlRXT19XRUVLU1xuICAgIH0pO1xuXG4gICAgZm4uYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2tpbmVzaXM6R2V0KidcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XXG4gICAgfSkpO1xuXG4gICAgZm4uYWRkRXZlbnRTb3VyY2UobmV3IEtpbmVzaXNFdmVudFNvdXJjZShzdHJlYW0sIHtcbiAgICAgIGJhdGNoU2l6ZTogMTAwLCAvLyBkZWZhdWx0XG4gICAgICBzdGFydGluZ1Bvc2l0aW9uOiBsYW1iZGEuU3RhcnRpbmdQb3NpdGlvbi5UUklNX0hPUklaT04sXG4gICAgfSkpO1xuICB9XG59XG4iXX0=