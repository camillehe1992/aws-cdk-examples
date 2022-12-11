import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cwlogs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";

/***
 * OpenSearchClientStack
 * In this stack, we define a lambda function to communicate with OpenSearch cluster.
 * The lambda function locates in the web security group we created in NetworkStack.
 *
 * This stack only enable basic features for demo purpose. Please refer to below link for more features
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.Function.html
 */

interface OpenSearchClientStackProps extends StackProps {
  lambdaName: string;
  domainEndpoint: string;
  domainName: string;
  vpc: ec2.Vpc;
  securityGroups: ec2.ISecurityGroup[];
}

export class OpenSearchClientStack extends Stack {
  public readonly fn: lambda.Function;

  constructor(scope: Construct, id: string, props: OpenSearchClientStackProps) {
    super(scope, id, props);

    // define a lambda function
    this.fn = new lambda.Function(this, "Function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(`${__dirname}/opensearch-client`, {}),
      memorySize: 128,
      functionName: props?.lambdaName,
      logRetention: cwlogs.RetentionDays.TWO_WEEKS,
      vpc: props?.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      timeout: Duration.seconds(5),
      environment: {
        ["OPENSEARCH_DOMAIN_URL"]: props.domainEndpoint,
        ["INDEX_NAME"]: "movies",
      },
      securityGroups: props.securityGroups,
    });

    // define access policy and associate with lambda execution role
    this.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["es:ESHttpGet*"],
        resources: [
          `arn:aws:es:${props.env?.region}:${props.env?.account}:domain/${props.domainName}/*/_search`,
        ],
        effect: iam.Effect.ALLOW,
      })
    );
  }
}
