export default {
  MAX_IMAGE_SIZE: 5000000,
  ACCEPTED_FILE_FORMATS: ["image/png", "image/jpeg", "image/jpg"],
  s3: {
    REGION: "us-east-2",
    BUCKET: "bubbler-api-prod-imagesbucket-17g8a4s4vk8t7"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://5l09l05h75.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_qZhcskiac",
    APP_CLIENT_ID: "4nb7ec55qiq8hs6mocvniq594q",
    IDENTITY_POOL_ID: "us-east-2:9323f935-943d-4a39-b756-a43bef451ce6"
  }
};
