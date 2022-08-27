import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class ThreeTiersNetworkCdkStack extends Stack {

  public readonly vpc: ec2.Vpc;
  public readonly webTierSG: ec2.SecurityGroup;
  public readonly appTierSG: ec2.SecurityGroup;
  public readonly dbTierSG: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Constants
    const VPC_NAME = 'main-vpc';
    const WEB_TIER_SG_NAME = 'web-tier-sg';
    const APP_TIER_SG_NAME = 'app-tier-sg';
    const DB_TIER_SG_NAME = 'db-tier-sg';

    // Resources
    this.vpc = new ec2.Vpc(this, 'MainVpc', {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      natGatewaySubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      maxAzs: 2,
      vpcName: VPC_NAME,
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3,
        }
      },
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
        }
      ],
    });
  
    // create a security group for a web server tier
    this.webTierSG = new ec2.SecurityGroup(this, 'WebTierSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
      securityGroupName: WEB_TIER_SG_NAME,
      description: 'security group for web server',
    });

    this.webTierSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    this.webTierSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere on port 80',
    );

    // create a security group for an app server tier
    this.appTierSG = new ec2.SecurityGroup(this, 'AppTierSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
      securityGroupName: APP_TIER_SG_NAME,
      description: 'security group for app server',
    });

    this.appTierSG.connections.allowFrom(
      new ec2.Connections({
        securityGroups: [this.webTierSG],
      }),
      ec2.Port.allTraffic(),
      `allow all traffic from ${WEB_TIER_SG_NAME}`,
    );

    // create a security group for a database server tier
    this.dbTierSG = new ec2.SecurityGroup(this, 'DatabaseTierSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
      securityGroupName: DB_TIER_SG_NAME,
      description: 'security group for database',
    });

    this.dbTierSG.connections.allowFrom(
      new ec2.Connections({
        securityGroups: [this.appTierSG],
      }),
      ec2.Port.tcp(3306),
      `allow traffic on port 3306 from ${APP_TIER_SG_NAME}`,
    );
  }
}
