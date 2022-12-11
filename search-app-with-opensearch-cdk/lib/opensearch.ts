import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as os from "aws-cdk-lib/aws-opensearchservice";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

import { OpenSearchClientStack } from "./opensearch-client";

/***
 * OpenSearchStack
 * In this stack, we define a development cluster in AWS OpenSearch, aka AWS ElasticSearch
 * and all related AWS resources needed to for a search application.
 *
 * This stack only enable basic features for demo purpose. Please refer to below link for more features
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_opensearchservice-readme.html
 */

interface OpenSearchStackProps extends StackProps {
  vpc: ec2.Vpc;
  webTierSg: ec2.SecurityGroup;
  opensearchTierSg: ec2.SecurityGroup;
  lambdaName: string;
  domainName: string;
}

export class OpenSearchStack extends Stack {
  constructor(scope: Construct, id: string, props: OpenSearchStackProps) {
    super(scope, id, props);

    const domain = new os.Domain(this, "Domain", {
      version: os.EngineVersion.OPENSEARCH_1_3,
      removalPolicy: RemovalPolicy.DESTROY,
      vpc: props?.vpc,
      vpcSubnets: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      securityGroups: [props.opensearchTierSg],
      // must be enabled since our VPC contains multiple private subnets.
      zoneAwareness: {
        enabled: true,
      },
      capacity: {
        // must be an even number since the default az count is 2.
        dataNodes: 2,
      },
      ebs: {
        volumeSize: 10,
        volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
      useUnsignedBasicAuth: true,
      enforceHttps: true,
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      fineGrainedAccessControl: {
        masterUserName: "root",
      },
      accessPolicies: [
        new iam.PolicyStatement({
          actions: ["es:*ESHttpPost", "es:ESHttpPut*", "es:*ESHttpGet"],
          effect: iam.Effect.ALLOW,
          principals: [new iam.AccountPrincipal(props?.env?.account)],
          resources: ["*"],
        }),
      ],
    });

    const client = new OpenSearchClientStack(this, "OpenSearchClientStack", {
      lambdaName: props.lambdaName,
      domainEndpoint: domain.domainEndpoint,
      domainName: props.domainName,
      vpc: props.vpc,
      securityGroups: [props.webTierSg],
      env: props.env,
    });

    client.node.addDependency(domain);
  }
}
