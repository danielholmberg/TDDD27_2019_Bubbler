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

  const params = {
    TableName: process.env.postsTableName,
    Key: {
      userId: data.userId,
      postId: data.postId
    }
  };

  // [START] Helper functions
  const notifyDeletionOfPost = async (connectionId, deletedPostId) => {
    return client
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          action: 'delete',
          id: deletedPostId
        })
      }).promise();
  }

  const deletePostFromDynamoDB = async () => {
    return dynamoDbLib.call("delete", params);
  }

  const broadcastDeletionOfPostToAll = async () => {
    const connectionsTable = await dynamoDbLib.call("scan", {
      TableName: process.env.connectionsTableName
    })

    console.log(connectionsTable)

    const postCalls = connectionsTable.Items.map( async ({ connectionId }) => {
      try { 
        console.log('notifyDeletionOfPost:', connectionId, )
        return await notifyDeletionOfPost(connectionId, data.postId)
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
    await deletePostFromDynamoDB();
    await broadcastDeletionOfPostToAll();
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
  
}
