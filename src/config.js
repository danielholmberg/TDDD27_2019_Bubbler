export default {
  MAX_IMAGE_SIZE: 5000000,
  ACCEPTED_FILE_FORMATS: ["image/png", "image/jpeg", "image/jpg"],
  dev: {
    s3: {
      REGION: "us-east-2",
      BUCKET: "bubbler-api-dev-imagesbucket-4bcwdq98us5l"
    },
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://k0piq193pa.execute-api.us-east-2.amazonaws.com/dev",
      WSS: "wss://1i7jy6713i.execute-api.us-east-2.amazonaws.com/dev"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_DytvYs8YI",
      APP_CLIENT_ID: "35iqoo6ntcdu94rmfk2qjdnio4",
      IDENTITY_POOL_ID: "us-east-2:f8e364fd-5434-4cc2-ac6e-b651500f6069"
    }
  },
  prod: {
    s3: {
      REGION: "us-east-2",
      BUCKET: "bubbler-api-prod-imagesbucket-17g8a4s4vk8t7"
    },
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://5l09l05h75.execute-api.us-east-2.amazonaws.com/prod",
      WSS: "wss://1k4jf0m48j.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_qZhcskiac",
      APP_CLIENT_ID: "4nb7ec55qiq8hs6mocvniq594q",
      IDENTITY_POOL_ID: "us-east-2:9323f935-943d-4a39-b756-a43bef451ce6"
    }
  }
};
