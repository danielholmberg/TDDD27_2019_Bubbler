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
Framework: **Express** (Node.js)
Server service: **AWS** (Serverless)
   - Cognito User Pool (User-functionality)
   - Cognito Identity Pool (User-persmissions)
   - S3 Bucket (File-storage)
   - IAM (Identity and Access Management)
   - **DynamoDB** (NoSQL)


## Development - Adding to the project
1. Clone the repository through your preferred process, *SSH* or *HTTPS*. 
2. Install the necessary dependencies with `npm install` inside each directory. The *package.json* in **root** directory shows the needed dependencies for root-level of the project:
```
...
"dependencies": {
    "<PACKAGE_NAME>":"^<VERSION_NUMBER",
},
...
```
3. Install a new package with `npm install <PACKAGE_NAME>`, this will (as of `npm 5.0.0`) automatically add the dependancy to the *package.json* file.
