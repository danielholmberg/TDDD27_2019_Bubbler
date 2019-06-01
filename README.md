# Bubbler - Frontend
Frameworks and 3rd party Libraries used:
- **React**
- React DOM
- React Loadable
- React Redux
- React Router Bootstrap
- React Bootstrap Typeahead
- Semantic UI React 
- **Redux**
- Redux Thunk
- Sockette
- **AWS SDK**
- AWS Amplify
- Amazon Cognito Identity

Service used for *frontend* hosting:
- AWS S3 bucket
 
## Development

### Initial process 
1. `git clone <SSH or HTTPS link>`
2. `cd tddd27_project_bubbler`
3. `git checkout --track origin/frontend` - this creates a local branch named `frontend` and sets it to track the remote `origin/frontend` branch.
4. `npm install` - install all necessary dependencies.


### Continuous process

1. `cd tddd27_project_bubbler`
2. `git checkout frontend` - make sure you are on the `frontend` branch.
3. `git pull` - get remote changes.
4. `npm start` - Runs the app in development mode.
   - Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
   - The page will reload if you make edits.<br>
   - Press **F12** in the browser to open **console**. 
5. `code .` - opens the project in VS Code.
6. **Make some changes** - and make sure it works **before** continuing to push the changes.
7. `git add <file>` - add files to commit.
8. `git commit -m "<explanatory message>"` - commit changes with an explanatory message.
9. `git push`

### Deploy changes to AWS S3 Bucket
10. `npm run build` - This packages all of our assets and places them in the **build/** directory.
11. `npm run deploy` - Added this command to the **package.json** which performs the following command: 
    -  `aws s3 sync build/ s3://bubbler-frontend --delete` - This syncs the **build/** directory with our bucket on S3. Note the `--delete` flag here; this is telling S3 to delete all the files that are in the bucket that we aren’t uploading this time around, without this flag we’ll end up retaining all the files from the previous builds.
12. And our app should be live on S3! To see it live, head over to [http://bubbler-frontend.s3-website.us-east-2.amazonaws.com/](http://bubbler-frontend.s3-website.us-east-2.amazonaws.com/)

