"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
// import { Template, Match } from 'aws-cdk-lib/assertions';
const Stack = require("../lib/static-site-s3-cdk-stack");
test('Main Stacks Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Stack.StaticSiteS3CdkStack(app, 'StaticSiteS3CdkStack');
    // THEN
    // const template = Template.fromStack(stack);
    // template.hasResourceProperties('AWS::SQS::Queue', {
    //   VisibilityTimeout: 300
    // });
    // template.resourceCountIs('AWS::SNS::Topic', 1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUtczMtY2RrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS1zMy1jZGsudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyw0REFBNEQ7QUFDNUQseURBQXlEO0FBRXpELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUIsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0lBQzFFLE9BQU87SUFFUCw4Q0FBOEM7SUFFOUMsc0RBQXNEO0lBQ3RELDJCQUEyQjtJQUMzQixNQUFNO0lBQ04sa0RBQWtEO0FBQ3BELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCB7IFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgU3RhY2sgZnJvbSAnLi4vbGliL3N0YXRpYy1zaXRlLXMzLWNkay1zdGFjayc7XG5cbnRlc3QoJ01haW4gU3RhY2tzIENyZWF0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIC8vIFdIRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2suU3RhdGljU2l0ZVMzQ2RrU3RhY2soYXBwLCAnU3RhdGljU2l0ZVMzQ2RrU3RhY2snKTtcbiAgLy8gVEhFTlxuXG4gIC8vIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAvLyB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgLy8gICBWaXNpYmlsaXR5VGltZW91dDogMzAwXG4gIC8vIH0pO1xuICAvLyB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6U05TOjpUb3BpYycsIDEpO1xufSk7XG4iXX0=