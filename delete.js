import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

/**
 * This makes a DynamoDB delete call with the userId & wineId key to delete the wine.
 */
export async function main(event, context) {
  const params = {
    TableName: "wines",
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'wineId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      wineId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
