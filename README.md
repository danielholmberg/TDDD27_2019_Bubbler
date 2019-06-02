# Bubbler - Backend
Our backend consists of a dual API-system with both a (1) REST API, and a (2) Websocket API to enable *Up-to-date* and *Real-time* functionalities. The AWS service, *API Gateway*, is used to create, publish, maintain, and monitor these APIs, e.g. handle an increased flow of concurrent API calls, and much more. 

Frameworks and 3rd party Libraries used:
- [**Serverless**](https://serverless.com/framework/docs/)
- [**Node.js**](https://nodejs.org/en/)
- [**AWS SDK**](https://docs.aws.amazon.com/sdk-for-javascript/index.html)
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html)
- [UUID](https://github.com/kelektiv/node-uuid#readme)

Services used to build the *backend*:
- **Amazon Web Services** ( [AWS](https://aws.amazon.com/) )
  - [**API Gateway**](https://aws.amazon.com/api-gateway/) (API hosting)
  - [**AWS Lambda**](https://aws.amazon.com/lambda/) (Lambda functions for API-endpoints)
  - [Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) (User-functionality)
  - [Cognito Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) (User-persmissions)
  - [IAM](https://aws.amazon.com/iam/) (Identity and Access Management)
  - [**S3 Bucket**](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html) (File-storage)
  - [CloudWatch](https://aws.amazon.com/cloudwatch/) (Log)
  - [**DynamoDB**](https://aws.amazon.com/dynamodb/) (NoSQL)

AWS allows us to scale our backend system without any additional costs in server-hardware or down-time maintenance, and much more.

## Development

### Initial process
1. `git clone <SSH or HTTPS link>`
2. `cd tddd27_project_bubbler`
3. `git checkout --track origin/backend` - this creates a local branch named `backend` and sets it to track the remote `origin/backend` branch.
4. `npm install` - install all necessary dependencies.

### Continuous process
1. `cd tddd27_project_bubbler`
2. `git checkout backend` - make sure you are on the `backend` branch.
3. `git pull` - get remote changes.
4. `serverless offline` - runs the backend in **offline** mode for development purposes.
5. `code .` - opens the project in VS Code.
6. **Make some changes** - and make sure it works **before** continuing to push the changes.
7. `git add <file>` - add files to commit.
8. `git commit -m "<explanatory message>"` - commit changes with an explanatory message.
9. `git push`

### Deploying
10. `serverless deploy function -f <FUNCTION_NAME>`
   - or use `serverless deploy` to deploy the entire backend API and **all** its functions.   
