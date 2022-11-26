"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const Stack = require("../lib/kinesis-streaming-stack");
test('SQS Queue and SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Stack.KinesisStreamingStack(app, 'MyTestKinesisStreamingStack');
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    // template.hasResourceProperties('AWS::SQS::Queue', {
    //   VisibilityTimeout: 300
    // });
    // template.resourceCountIs('AWS::SNS::Topic', 1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1zdHJlYW1pbmctc3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImtpbmVzaXMtc3RyZWFtaW5nLXN0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXlEO0FBQ3pELHdEQUF3RDtBQUV4RCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO0lBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFCLE9BQU87SUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztJQUNsRixPQUFPO0lBRVAsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFM0Msc0RBQXNEO0lBQ3RELDJCQUEyQjtJQUMzQixNQUFNO0lBQ04sa0RBQWtEO0FBQ3BELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XHJcbmltcG9ydCAqIGFzIFN0YWNrIGZyb20gJy4uL2xpYi9raW5lc2lzLXN0cmVhbWluZy1zdGFjayc7XHJcblxyXG50ZXN0KCdTUVMgUXVldWUgYW5kIFNOUyBUb3BpYyBDcmVhdGVkJywgKCkgPT4ge1xyXG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcbiAgLy8gV0hFTlxyXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrLktpbmVzaXNTdHJlYW1pbmdTdGFjayhhcHAsICdNeVRlc3RLaW5lc2lzU3RyZWFtaW5nU3RhY2snKTtcclxuICAvLyBUSEVOXHJcblxyXG4gIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcclxuXHJcbiAgLy8gdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNRUzo6UXVldWUnLCB7XHJcbiAgLy8gICBWaXNpYmlsaXR5VGltZW91dDogMzAwXHJcbiAgLy8gfSk7XHJcbiAgLy8gdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OlNOUzo6VG9waWMnLCAxKTtcclxufSk7XHJcbiJdfQ==