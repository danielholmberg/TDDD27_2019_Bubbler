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

  // Note: check Reserved words in DynamoDB (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
  // before adding or changing attribute names.
  const params = {
    TableName: process.env.postsTableName,
    Key: {
      userId: data.userId,
      postId: data.postId
    },
    UpdateExpression: `SET 
    productId = :productId, 
    price = :price,
    country = :country,
    volume = :volume,
    label = :label, 
    image = :image, 
    rating = :rating, 
    reviewComment = :reviewComment, 
    updatedAt = :updatedAt`,
    ExpressionAttributeValues: {
      ":productId": data.productId || null,
      ":price": data.price || 0,
      ":country": data.country || 'Unknown',
      ":volume": data.volume || 0,
      ":label": data.label || null,
      ":image": data.image || null,
      ":reviewComment": data.reviewComment || null,
      ":rating": data.rating || 0,
      ":updatedAt": Date.now(),
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  // [START] Helper functions
  const notifyOfUpdatedPost = async (connectionId, updatedPost) => {
    return client
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          action: 'update',
          post: updatedPost
        })
      }).promise();
  }

  const updatePostInDynamoDB = async () => {
    return dynamoDbLib.call("update", params);
  }

  const broadcastUpdatedPostToAll = async (updatedPost) => {
    const connectionsTable = await dynamoDbLib.call("scan", {
      TableName: process.env.connectionsTableName
    })

    console.log(connectionsTable)

    const postCalls = connectionsTable.Items.map( async ({ connectionId }) => {
      try { 
        console.log('notifyOfUpdatedPost:', connectionId, updatedPost)
        return await notifyOfUpdatedPost(connectionId, updatedPost)
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
    const response = await updatePostInDynamoDB();
    console.log('response:', response);
    const { userId, postId, productId, price, country, volume, label, image, reviewComment, rating, addedAt, updatedAt } = response.Attributes;
    const updatedPost = {
      userId,
      postId,
      productId,
      price,
      country,
      volume,
      label,
      image,
      reviewComment,
      rating,
      addedAt,
      updatedAt
    }
    await broadcastUpdatedPostToAll(updatedPost);
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
  
}
