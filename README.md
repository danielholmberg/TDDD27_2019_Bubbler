# TDDD27 Project: Bubbler
## Functional specification
A social platform to share your opinion on sparkling wines. The concept is similar to other social platforms that target beverages, i.e. [Untappd](https://untappd.com/) and [Vivino](https://www.vivino.com/).

### Core functionality
* User-profile page.
* *Add*, *change*, *remove*, and *rate* sparkling wines, i.e. **check-in**.
* Interact with other users by for example see others' activity.

### Possible additional functionality
* Highscore lists showing:
   - Total amout of spent money for all your beverages.
   - The possibilty to *toast* other's check-ins.
   - The possibility to *comment* other's check-ins.
   - Choose *your current location*, *location of purchase*, *type of glas used when consumed* and *possible friends with whom you consume the beverage* for all your check-ins. 

## Technological specification
### Front-end
Framework: **React + Redux** (Javascript)


### Back-end
Framework: **Node.js** (Javascript)

Server service: **AWS** (Serverless)
   - Cognito User Pool (User-functionality)
   - Cognito Identity Pool (User-persmissions)
   - S3 Bucket (File-storage)
   - IAM (Identity and Access Management)
   - **DynamoDB** (NoSQL)


## Development - Adding to the project
1. `git clone <SSH or HTTPS>`
2. `cd tddd27_project_bubbler`
3. `git branch -a` - shows all available branches, including remotes `origin/<BRANCH_NAME>`
4. `git checkout --track origin/<BRANCH_NAME>` - this creates a local branch named `<BRANCH_NAME>` and sets it to track the remote `origin/<BRANCH_NAME>` branch.
5. `npm install` - install all necessary dependencies.
