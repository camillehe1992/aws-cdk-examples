import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as amplify  from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import conf from '../config';

export class AmplifyAppCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const SECRET_NAME = 'my-github-token';

    const { owner, repository, gitHubOauthToken } = conf;

    // Resources
    const secret = new secretsmanager.Secret(this, 'Secret', {
      secretName: SECRET_NAME,
      secretStringValue: SecretValue.unsafePlainText(gitHubOauthToken)
    })
    const amplifyApp = new amplify.App(this, 'AmplifyCfnApp', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner,
        repository,
        oauthToken: SecretValue.secretsManager(secret.secretArn)
      }),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'npm install',
              ],
            },
            build: {
              commands: [
                'npm build',
              ],
            },
          },
          artifacts: {
            baseDirectory: 'public',
            files:
            - '**/*',
          },
        },
      }),
    });

    const master = amplifyApp.addBranch('master');
    master.addEnvironment('STAGE', 'dev');
  }
}
