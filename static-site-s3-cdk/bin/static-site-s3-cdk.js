#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const static_site_s3_cdk_stack_1 = require("../lib/static-site-s3-cdk-stack");
const config_1 = require("../config");
const env = {
    account: config_1.default.account,
    region: config_1.default.region
};
const app = new cdk.App();
new static_site_s3_cdk_stack_1.StaticSiteS3CdkStack(app, 'StaticSiteS3CdkStack', {
    bucketName: `static-site-s3-${config_1.default.account}-${config_1.default.region}`,
    env
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtczMtY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGljLXNpdGUtczMtY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFtQztBQUNuQyw4RUFBdUU7QUFDdkUsc0NBQTZCO0FBRTdCLE1BQU0sR0FBRyxHQUFHO0lBQ1YsT0FBTyxFQUFFLGdCQUFJLENBQUMsT0FBTztJQUNyQixNQUFNLEVBQUUsZ0JBQUksQ0FBQyxNQUFNO0NBQ3BCLENBQUE7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUcxQixJQUFJLCtDQUFvQixDQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtJQUNwRCxVQUFVLEVBQUUsa0JBQWtCLGdCQUFJLENBQUMsT0FBTyxJQUFJLGdCQUFJLENBQUMsTUFBTSxFQUFFO0lBQzNELEdBQUc7Q0FDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgU3RhdGljU2l0ZVMzQ2RrU3RhY2sgfSBmcm9tICcuLi9saWIvc3RhdGljLXNpdGUtczMtY2RrLXN0YWNrJztcbmltcG9ydCBjb25mIGZyb20gJy4uL2NvbmZpZyc7XG5cbmNvbnN0IGVudiA9IHtcbiAgYWNjb3VudDogY29uZi5hY2NvdW50LFxuICByZWdpb246IGNvbmYucmVnaW9uXG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cblxubmV3IFN0YXRpY1NpdGVTM0Nka1N0YWNrKGFwcCwgJ1N0YXRpY1NpdGVTM0Nka1N0YWNrJywgeyBcbiAgYnVja2V0TmFtZTogYHN0YXRpYy1zaXRlLXMzLSR7Y29uZi5hY2NvdW50fS0ke2NvbmYucmVnaW9ufWAsXG4gIGVudlxufSk7XG4iXX0=