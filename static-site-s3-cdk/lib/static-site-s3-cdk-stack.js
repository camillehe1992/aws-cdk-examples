"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSiteS3CdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const iam = require("aws-cdk-lib/aws-iam");
class StaticSiteS3CdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // create a S3 bucket to host assets for static website
        const assetsBucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: props === null || props === void 0 ? void 0 : props.bucketName,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.RETAIN,
            accessControl: s3.BucketAccessControl.PRIVATE,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            encryption: s3.BucketEncryption.S3_MANAGED,
        });
        // create a OAI to access assets on S3 bucket
        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudFrontOriginAccessIdentity');
        assetsBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [assetsBucket.arnForObjects('*')],
            principals: [
                new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)
            ],
        }));
        //  
        const rewriteFunction = new cloudfront.Function(this, 'Function', {
            code: cloudfront.FunctionCode.fromFile({ filePath: `${__dirname}/functions/url-rewrite.js` }),
        });
        const cloudfrontDistribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
            defaultRootObject: 'docs/index.html',
            defaultBehavior: {
                origin: new origins.S3Origin(assetsBucket, {
                    originAccessIdentity: cloudfrontOAI
                }),
                functionAssociations: [{
                        function: rewriteFunction,
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST
                    }]
            },
        });
    }
}
exports.StaticSiteS3CdkStack = StaticSiteS3CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtczMtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGljLXNpdGUtczMtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUErRDtBQUMvRCx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDhEQUE4RDtBQUM5RCwyQ0FBMkM7QUFRM0MsTUFBYSxvQkFBcUIsU0FBUSxtQkFBSztJQUM3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHVEQUF1RDtRQUN2RCxNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN4RCxVQUFVLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFVBQVU7WUFDN0IsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxNQUFNO1lBQ25DLGFBQWEsRUFBRSxFQUFFLENBQUMsbUJBQW1CLENBQUMsT0FBTztZQUM3QyxlQUFlLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUI7WUFDekQsVUFBVSxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVO1NBQzNDLENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxNQUFNLGFBQWEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztRQUVsRyxZQUFZLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3ZELE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztZQUN6QixTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLFVBQVUsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUM7YUFDOUY7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLElBQUk7UUFDSixNQUFNLGVBQWUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNoRSxJQUFJLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxTQUFTLDJCQUEyQixFQUFFLENBQUM7U0FDOUYsQ0FBQyxDQUFDO1FBRUgsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ3pGLGlCQUFpQixFQUFFLGlCQUFpQjtZQUNwQyxlQUFlLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFO29CQUN2QyxvQkFBb0IsRUFBRSxhQUFhO2lCQUN0QyxDQUFDO2dCQUNGLG9CQUFvQixFQUFFLENBQUM7d0JBQ25CLFFBQVEsRUFBRSxlQUFlO3dCQUN6QixTQUFTLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLGNBQWM7cUJBQ3pELENBQUM7YUFDRDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTVDRCxvREE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgUmVtb3ZhbFBvbGljeSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuaW50ZXJmYWNlIFN0YXRpY1NpdGVTM0Nka1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIC8vIHRoZSBuYW1lIG9mIHRoZSBzdGF0aWMgc2l0ZSBzMyBidWNrZXRcbiAgYnVja2V0TmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdGljU2l0ZVMzQ2RrU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhdGljU2l0ZVMzQ2RrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIGNyZWF0ZSBhIFMzIGJ1Y2tldCB0byBob3N0IGFzc2V0cyBmb3Igc3RhdGljIHdlYnNpdGVcbiAgICBjb25zdCBhc3NldHNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdXZWJzaXRlQnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogcHJvcHM/LmJ1Y2tldE5hbWUsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICAgIGFjY2Vzc0NvbnRyb2w6IHMzLkJ1Y2tldEFjY2Vzc0NvbnRyb2wuUFJJVkFURSxcbiAgICAgIG9iamVjdE93bmVyc2hpcDogczMuT2JqZWN0T3duZXJzaGlwLkJVQ0tFVF9PV05FUl9FTkZPUkNFRCxcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCxcbiAgICB9KTtcblxuICAgIC8vIGNyZWF0ZSBhIE9BSSB0byBhY2Nlc3MgYXNzZXRzIG9uIFMzIGJ1Y2tldFxuICAgIGNvbnN0IGNsb3VkZnJvbnRPQUkgPSBuZXcgY2xvdWRmcm9udC5PcmlnaW5BY2Nlc3NJZGVudGl0eSh0aGlzLCAnQ2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5Jyk7XG4gIFxuICAgIGFzc2V0c0J1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICByZXNvdXJjZXM6IFthc3NldHNCdWNrZXQuYXJuRm9yT2JqZWN0cygnKicpXSxcbiAgICAgIHByaW5jaXBhbHM6IFtcbiAgICAgICAgbmV3IGlhbS5DYW5vbmljYWxVc2VyUHJpbmNpcGFsKGNsb3VkZnJvbnRPQUkuY2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5UzNDYW5vbmljYWxVc2VySWQpXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIC8vICBcbiAgICBjb25zdCByZXdyaXRlRnVuY3Rpb24gPSBuZXcgY2xvdWRmcm9udC5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBjbG91ZGZyb250LkZ1bmN0aW9uQ29kZS5mcm9tRmlsZSh7IGZpbGVQYXRoOiBgJHtfX2Rpcm5hbWV9L2Z1bmN0aW9ucy91cmwtcmV3cml0ZS5qc2AgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG91ZGZyb250RGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uKHRoaXMsICdDbG91ZEZyb250RGlzdHJpYnV0aW9uJywge1xuICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdkb2NzL2luZGV4Lmh0bWwnLFxuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7XG4gICAgICBvcmlnaW46IG5ldyBvcmlnaW5zLlMzT3JpZ2luKGFzc2V0c0J1Y2tldCwge1xuICAgICAgICAgIG9yaWdpbkFjY2Vzc0lkZW50aXR5OiBjbG91ZGZyb250T0FJXG4gICAgICB9KSxcbiAgICAgIGZ1bmN0aW9uQXNzb2NpYXRpb25zOiBbe1xuICAgICAgICAgIGZ1bmN0aW9uOiByZXdyaXRlRnVuY3Rpb24sXG4gICAgICAgICAgZXZlbnRUeXBlOiBjbG91ZGZyb250LkZ1bmN0aW9uRXZlbnRUeXBlLlZJRVdFUl9SRVFVRVNUXG4gICAgICB9XVxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuIl19