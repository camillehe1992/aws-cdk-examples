import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

/***
 * NetworkStack
 * In this stack, we define the network related resources for OpenSearch. It contains a Non-Public VPC,
 * three public subnets and three private subnets, two security group, one for web application which is external
 * accessiable and one for OpenSearch cluster which only allows traffic from web application security group via
 * specific port.
 *
 * This stack only enable basic features for demo purpose. Please refer to below link for more features
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html
 */

interface NetworkStackProps extends StackProps {
  vpcName: string;
  vpcCidr: string;
  webTierSgName: string;
  opensearchSgName: string;
}

export class NetworkStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly webTierSg: ec2.SecurityGroup;
  public readonly opensearchSg: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: NetworkStackProps) {
    super(scope, id, props);

    // Resources
    this.vpc = new ec2.Vpc(this, "MainVpc", {
      ipAddresses: ec2.IpAddresses.cidr(props?.vpcCidr || ""),
      natGateways: 0,
      maxAzs: 2,
      vpcName: props?.vpcName,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // create a security group for a web server tier
    this.webTierSg = new ec2.SecurityGroup(this, "WebTierSecurityGroup", {
      vpc: this.vpc,
      allowAllOutbound: true,
      securityGroupName: props?.webTierSgName,
      description: "security group for web server",
    });

    this.webTierSg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "allow SSH access from anywhere"
    );

    this.webTierSg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "allow HTTP traffic from anywhere on port 80"
    );

    // create a security group for a database server tier
    this.opensearchSg = new ec2.SecurityGroup(this, "OpenSearchSecurityGroup", {
      vpc: this.vpc,
      allowAllOutbound: true,
      securityGroupName: props?.opensearchSgName,
      description: "security group for OpenSearch cluster",
    });

    this.opensearchSg.connections.allowFrom(
      new ec2.Connections({
        securityGroups: [this.webTierSg],
      }),
      ec2.Port.tcp(9012),
      `allow traffic on port 9012 from ${props?.opensearchSgName}`
    );
  }
}
