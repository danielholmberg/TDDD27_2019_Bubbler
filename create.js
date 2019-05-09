import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

/**
 * We are also using the async/await pattern here to refactor our Lambda function. 
 * This allows us to return once we are done processing; instead of using a callback function.
 */
export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      postId: uuid.v1(),
      productId: data.productId,
      label: data.label,
      image: data.image,
      comment: data.comment,
      rating: data.rating,
      addedAt: Date.now(),
      updatedAt: null,
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
