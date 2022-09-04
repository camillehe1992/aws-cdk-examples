import { Stack, Duration, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface StaticSiteS3CdkProps extends StackProps {
  // the name of the static site s3 bucket
  bucketName: string;
}

export class StaticSiteS3CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StaticSiteS3CdkProps) {
    super(scope, id, props);

    // create a S3 bucket to host assets for static website
    const assetsBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: props?.bucketName,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      encryption: s3.BucketEncryption.S3_MANAGED,
      // By setting the bucket's removalPolicy to DESTROY and setting the autoDeleteObjects property to true
      // we were able to empty a bucket's contents and delete it when the stack is deleted.
      removalPolicy: RemovalPolicy.DESTROY,
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
          contentSecurityPolicy: "style-src-elem https://cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css; script-src-elem https://cdn.jsdelivr.net/npm/docsify@4"
        },
        strictTransportSecurity: {
          override: true,
          accessControlMaxAge: Duration.days(2 * 365),
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
