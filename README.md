# Bubbler Backend - Node.js
Framework: **Serverless** (Node.js)

Server service: **AWS** (Serverless)
   - Cognito User Pool (User-functionality)
   - Cognito Identity Pool (User-persmissions)
   - S3 Bucket (File-storage)
   - IAM (Identity and Access Management)
   - **DynamoDB** (NoSQL)

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
