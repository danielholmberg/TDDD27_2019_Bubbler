export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-2",
    BUCKET: "bubbler-user-uploads"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://n52rvdx36i.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_3ibVmw8SG",
    APP_CLIENT_ID: "58kmqapteiqp0v7nb390t85tqn",
    IDENTITY_POOL_ID: "us-east-2:e392833e-5dd8-4049-a8f6-f0f4f57f7aa9"
  }
};
