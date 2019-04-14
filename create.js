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
    TableName: "wines",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
