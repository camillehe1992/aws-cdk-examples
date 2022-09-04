# Static Site Deployment using AWS CloudFront, S3 and the CDK

This project provides a solution that host a static website in S3 bucket using Github actions and delivery the static web content via CloudFront.

## Setup

```sh
# cp .env.sample to .env and update your AWS account/region
# Install dependencies
npm install

# Deloy stacks into your AWS account/region
npm run deploy

# Destroy stacks from your AWS account/region
npm run destroy
```

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## References

https://idanlupinsky.com/blog/static-site-deployment-using-aws-cloudfront-and-the-cdk/
https://johnkevinlosito.com/posts/deploy-static-website-to-s3-using-github-actions
https://docsify.js.org/#/deploy?id=github-pages
https://aws.amazon.com/cn/blogs/networking-and-content-delivery/amazon-s3-amazon-cloudfront-a-match-made-in-the-cloud/
