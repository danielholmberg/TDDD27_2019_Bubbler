export default {
  MAX_IMAGE_SIZE: 5000000,
  ACCEPTED_FILE_FORMATS: ["image/png", "image/jpeg", "image/jpg"],
  s3: {
    REGION: "us-east-2",
    BUCKET: "bubbler-api-prod-imagesbucket-zwyush72ktle"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://n52rvdx36i.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_XvFYyc4fb",
    APP_CLIENT_ID: "6b6k6b8kuh65sp47krh4o2c8jr",
    IDENTITY_POOL_ID: "us-east-2:dc57d1c2-166b-4d5d-b92a-bdc3dc370dd4"
  }
};
