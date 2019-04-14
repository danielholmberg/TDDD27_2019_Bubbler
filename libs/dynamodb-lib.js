/**
 * Here we are using the promise form of the DynamoDB methods. 
 * Promises are a method for managing asynchronous code that 
 * serve as an alternative to the standard callback function syntax.
 * It will make our code a lot easier to read.
 */

import AWS from "aws-sdk";

export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}
