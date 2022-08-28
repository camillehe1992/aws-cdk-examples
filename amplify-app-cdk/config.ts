import 'dotenv/config'

export default {
  // General
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION,
  // Specific
  owner: process.env.REPOSITORY_OWNER || 'camillehe1992',
  repository: process.env.REPOSITORY_NAME || 'sample-vue3-app',
  gitHubOauthToken: process.env.GITHUB_OAUTH_TOKEN || '',
  
};