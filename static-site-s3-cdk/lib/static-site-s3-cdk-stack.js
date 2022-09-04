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
            accessControl: s3.BucketAccessControl.PRIVATE,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            encryption: s3.BucketEncryption.S3_MANAGED,
            // By setting the bucket's removalPolicy to DESTROY and setting the autoDeleteObjects property to true
            // we were able to empty a bucket's contents and delete it when the stack is deleted.
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
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
        const responseHeaderPolicy = new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeadersResponseHeaderPolicy', {
            comment: 'Security headers response header policy',
            securityHeadersBehavior: {
                contentSecurityPolicy: {
                    override: true,
                    // contentSecurityPolicy: "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'"
                    contentSecurityPolicy: "default-src 'self'"
                },
                strictTransportSecurity: {
                    override: true,
                    accessControlMaxAge: aws_cdk_lib_1.Duration.days(2 * 365),
                    includeSubdomains: true,
                    preload: true
                },
                contentTypeOptions: {
                    override: true
                },
                referrerPolicy: {
                    override: true,
                    referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                },
                xssProtection: {
                    override: true,
                    protection: true,
                    modeBlock: true
                },
                frameOptions: {
                    override: true,
                    frameOption: cloudfront.HeadersFrameOption.DENY
                }
            }
        });
        const cloudfrontDistribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new origins.S3Origin(assetsBucket, {
                    originAccessIdentity: cloudfrontOAI
                }),
                functionAssociations: [{
                        function: rewriteFunction,
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST
                    }],
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                responseHeadersPolicy: responseHeaderPolicy
            },
        });
    }
}
exports.StaticSiteS3CdkStack = StaticSiteS3CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtczMtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGljLXNpdGUtczMtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUF5RTtBQUN6RSx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELDhEQUE4RDtBQUM5RCwyQ0FBMkM7QUFRM0MsTUFBYSxvQkFBcUIsU0FBUSxtQkFBSztJQUM3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHVEQUF1RDtRQUN2RCxNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN4RCxVQUFVLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFVBQVU7WUFDN0IsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxhQUFhLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLE9BQU87WUFDN0MsZUFBZSxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMscUJBQXFCO1lBQ3pELFVBQVUsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVTtZQUMxQyxzR0FBc0c7WUFDdEcscUZBQXFGO1lBQ3JGLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFFbEcsWUFBWSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN2RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDO2FBQzlGO1NBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFJO1FBQ0osTUFBTSxlQUFlLEdBQUcsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDaEUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsU0FBUywyQkFBMkIsRUFBRSxDQUFDO1NBQzlGLENBQUMsQ0FBQztRQUVILE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxVQUFVLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLHFDQUFxQyxFQUFFO1lBQzdHLE9BQU8sRUFBRSx5Q0FBeUM7WUFDbEQsdUJBQXVCLEVBQUU7Z0JBQ3ZCLHFCQUFxQixFQUFFO29CQUNyQixRQUFRLEVBQUUsSUFBSTtvQkFDZCxzSEFBc0g7b0JBQ3RILHFCQUFxQixFQUFFLG9CQUFvQjtpQkFDNUM7Z0JBQ0QsdUJBQXVCLEVBQUU7b0JBQ3ZCLFFBQVEsRUFBRSxJQUFJO29CQUNkLG1CQUFtQixFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQzNDLGlCQUFpQixFQUFFLElBQUk7b0JBQ3ZCLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELGtCQUFrQixFQUFFO29CQUNsQixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsUUFBUSxFQUFFLElBQUk7b0JBQ2QsY0FBYyxFQUFFLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQywrQkFBK0I7aUJBQ2pGO2dCQUNELGFBQWEsRUFBRTtvQkFDYixRQUFRLEVBQUUsSUFBSTtvQkFDZCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsU0FBUyxFQUFFLElBQUk7aUJBQ2hCO2dCQUNELFlBQVksRUFBRTtvQkFDWixRQUFRLEVBQUUsSUFBSTtvQkFDZCxXQUFXLEVBQUUsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUk7aUJBQ2hEO2FBQ0Y7U0FDSixDQUFDLENBQUM7UUFFRCxNQUFNLHNCQUFzQixHQUFHLElBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDekYsaUJBQWlCLEVBQUUsWUFBWTtZQUMvQixlQUFlLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFO29CQUN2QyxvQkFBb0IsRUFBRSxhQUFhO2lCQUN0QyxDQUFDO2dCQUNGLG9CQUFvQixFQUFFLENBQUM7d0JBQ25CLFFBQVEsRUFBRSxlQUFlO3dCQUN6QixTQUFTLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLGNBQWM7cUJBQ3pELENBQUM7Z0JBQ0Ysb0JBQW9CLEVBQUUsVUFBVSxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQjtnQkFDdkUscUJBQXFCLEVBQUUsb0JBQW9CO2FBQzFDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbEZELG9EQWtGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBEdXJhdGlvbiwgU3RhY2tQcm9wcywgUmVtb3ZhbFBvbGljeSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuaW50ZXJmYWNlIFN0YXRpY1NpdGVTM0Nka1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIC8vIHRoZSBuYW1lIG9mIHRoZSBzdGF0aWMgc2l0ZSBzMyBidWNrZXRcbiAgYnVja2V0TmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdGljU2l0ZVMzQ2RrU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhdGljU2l0ZVMzQ2RrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIGNyZWF0ZSBhIFMzIGJ1Y2tldCB0byBob3N0IGFzc2V0cyBmb3Igc3RhdGljIHdlYnNpdGVcbiAgICBjb25zdCBhc3NldHNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdXZWJzaXRlQnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogcHJvcHM/LmJ1Y2tldE5hbWUsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLlBSSVZBVEUsXG4gICAgICBvYmplY3RPd25lcnNoaXA6IHMzLk9iamVjdE93bmVyc2hpcC5CVUNLRVRfT1dORVJfRU5GT1JDRUQsXG4gICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQsXG4gICAgICAvLyBCeSBzZXR0aW5nIHRoZSBidWNrZXQncyByZW1vdmFsUG9saWN5IHRvIERFU1RST1kgYW5kIHNldHRpbmcgdGhlIGF1dG9EZWxldGVPYmplY3RzIHByb3BlcnR5IHRvIHRydWVcbiAgICAgIC8vIHdlIHdlcmUgYWJsZSB0byBlbXB0eSBhIGJ1Y2tldCdzIGNvbnRlbnRzIGFuZCBkZWxldGUgaXQgd2hlbiB0aGUgc3RhY2sgaXMgZGVsZXRlZC5cbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gY3JlYXRlIGEgT0FJIHRvIGFjY2VzcyBhc3NldHMgb24gUzMgYnVja2V0XG4gICAgY29uc3QgY2xvdWRmcm9udE9BSSA9IG5ldyBjbG91ZGZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsICdDbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHknKTtcbiAgXG4gICAgYXNzZXRzQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnXSxcbiAgICAgIHJlc291cmNlczogW2Fzc2V0c0J1Y2tldC5hcm5Gb3JPYmplY3RzKCcqJyldLFxuICAgICAgcHJpbmNpcGFsczogW1xuICAgICAgICBuZXcgaWFtLkNhbm9uaWNhbFVzZXJQcmluY2lwYWwoY2xvdWRmcm9udE9BSS5jbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlTM0Nhbm9uaWNhbFVzZXJJZClcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgLy8gIFxuICAgIGNvbnN0IHJld3JpdGVGdW5jdGlvbiA9IG5ldyBjbG91ZGZyb250LkZ1bmN0aW9uKHRoaXMsICdGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGNsb3VkZnJvbnQuRnVuY3Rpb25Db2RlLmZyb21GaWxlKHsgZmlsZVBhdGg6IGAke19fZGlybmFtZX0vZnVuY3Rpb25zL3VybC1yZXdyaXRlLmpzYCB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlSGVhZGVyUG9saWN5ID0gbmV3IGNsb3VkZnJvbnQuUmVzcG9uc2VIZWFkZXJzUG9saWN5KHRoaXMsICdTZWN1cml0eUhlYWRlcnNSZXNwb25zZUhlYWRlclBvbGljeScsIHtcbiAgICAgIGNvbW1lbnQ6ICdTZWN1cml0eSBoZWFkZXJzIHJlc3BvbnNlIGhlYWRlciBwb2xpY3knLFxuICAgICAgc2VjdXJpdHlIZWFkZXJzQmVoYXZpb3I6IHtcbiAgICAgICAgY29udGVudFNlY3VyaXR5UG9saWN5OiB7XG4gICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgLy8gY29udGVudFNlY3VyaXR5UG9saWN5OiBcImRlZmF1bHQtc3JjICdzZWxmJzsgaW1nLXNyYyAnc2VsZic7IHNjcmlwdC1zcmMgJ3NlbGYnOyBzdHlsZS1zcmMgJ3NlbGYnOyBvYmplY3Qtc3JjICdub25lJ1wiXG4gICAgICAgICAgY29udGVudFNlY3VyaXR5UG9saWN5OiBcImRlZmF1bHQtc3JjICdzZWxmJ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHN0cmljdFRyYW5zcG9ydFNlY3VyaXR5OiB7XG4gICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgYWNjZXNzQ29udHJvbE1heEFnZTogRHVyYXRpb24uZGF5cygyICogMzY1KSxcbiAgICAgICAgICBpbmNsdWRlU3ViZG9tYWluczogdHJ1ZSxcbiAgICAgICAgICBwcmVsb2FkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRUeXBlT3B0aW9uczoge1xuICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlZmVycmVyUG9saWN5OiB7XG4gICAgICAgICAgb3ZlcnJpZGU6IHRydWUsXG4gICAgICAgICAgcmVmZXJyZXJQb2xpY3k6IGNsb3VkZnJvbnQuSGVhZGVyc1JlZmVycmVyUG9saWN5LlNUUklDVF9PUklHSU5fV0hFTl9DUk9TU19PUklHSU5cbiAgICAgICAgfSxcbiAgICAgICAgeHNzUHJvdGVjdGlvbjoge1xuICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgIHByb3RlY3Rpb246IHRydWUsXG4gICAgICAgICAgbW9kZUJsb2NrOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGZyYW1lT3B0aW9uczoge1xuICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgIGZyYW1lT3B0aW9uOiBjbG91ZGZyb250LkhlYWRlcnNGcmFtZU9wdGlvbi5ERU5ZXG4gICAgICAgIH1cbiAgICAgIH1cbiAgfSk7XG5cbiAgICBjb25zdCBjbG91ZGZyb250RGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uKHRoaXMsICdDbG91ZEZyb250RGlzdHJpYnV0aW9uJywge1xuICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgb3JpZ2luOiBuZXcgb3JpZ2lucy5TM09yaWdpbihhc3NldHNCdWNrZXQsIHtcbiAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eTogY2xvdWRmcm9udE9BSVxuICAgICAgfSksXG4gICAgICBmdW5jdGlvbkFzc29jaWF0aW9uczogW3tcbiAgICAgICAgICBmdW5jdGlvbjogcmV3cml0ZUZ1bmN0aW9uLFxuICAgICAgICAgIGV2ZW50VHlwZTogY2xvdWRmcm9udC5GdW5jdGlvbkV2ZW50VHlwZS5WSUVXRVJfUkVRVUVTVFxuICAgICAgfV0sXG4gICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQUyxcbiAgICAgIHJlc3BvbnNlSGVhZGVyc1BvbGljeTogcmVzcG9uc2VIZWFkZXJQb2xpY3lcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==