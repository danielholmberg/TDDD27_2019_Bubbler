import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

/**
 * Here we make an update DynamoDB call with the new content and attachment values in the params.
 */
export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'wineId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      wineId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET label = :label, image = :image, rating = :rating, comment = :comment",
    ExpressionAttributeValues: {
      ":image": data.image || null,
      ":label": data.label || null,
      ":comment": data.comment || null,
      ":rating": data.rating || 0
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
