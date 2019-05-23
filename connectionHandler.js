import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function connect(event, context) {
  const params = {
    TableName: process.env.connectionsTableName,
    Item: {
      connectionId: event.requestContext.connectionId
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

export async function disconnect(event, context) {
  const params = {
    TableName: process.env.connectionsTableName,
    Key: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await dynamoDbLib.call("delete", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}