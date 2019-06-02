import uuid from "uuid";  
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import * as Promise from 'bluebird';

import AWS from "aws-sdk";
require('aws-sdk/clients/apigatewaymanagementapi');

export async function main(event, context) {
  const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint
  });

  const body = JSON.parse(event.body);
  const data = body.data;

  // Construct the new Item to store in DynamoDB table: ${self:custom.postsTableName}
  // Note: check Reserved words in DynamoDB (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
  // before adding or changing attribute names.
  const params = {
    TableName: process.env.postsTableName,
    Item: {
      userId: data.userId,
      postId: uuid.v1(),
      productId: data.productId,
      price: data.price,
      country: data.country,
      volume: data.volume,
      label: data.label,
      image: data.image,
      reviewComment: data.reviewComment,
      rating: data.rating,
      addedAt: Date.now(),
      updatedAt: null,
    }
  };

  // [START] Helper functions
  const notifyOfNewPost = async (connectionId, newItem) => {
    return client
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          action: 'add',
          post: newItem
        })
      }).promise();
  }

  const addNewPostToDynaomDB = async () => {
    return dynamoDbLib.call("put", params);
  }

  const broadcastNewPostToAll = async () => {
    const connectionsTable = await dynamoDbLib.call("scan", {
      TableName: process.env.connectionsTableName
    })

    console.log(connectionsTable)

    const postCalls = connectionsTable.Items.map( async ({ connectionId }) => {
      try { 
        console.log('notifyOfNewPost:', connectionId, params.Item)
        return await notifyOfNewPost(connectionId, params.Item)
      } catch (e) {
        if (e.statusCode === 410) {
          return await deleteConnection(connectionId.S);
        }
        console.log(JSON.stringify(e));
        throw e;
      }
    })
    console.log('postCalls:', postCalls);
    await Promise.all(postCalls) 
  }

  const deleteConnection = connectionId => {
    const deleteParams = {
      TableName: process.env.connectionsTableName,
      Key: {
        connectionId: connectionId
      }
    };
  
    return dynamoDbLib.call("delete", deleteParams);
  };
  
  // [END] Helper functions

  try {
    await addNewPostToDynaomDB();
    await broadcastNewPostToAll();
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
  
}
