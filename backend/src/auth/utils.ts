import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import * as AWS  from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export async function todoExists(todoId: string, userId: string) {
  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression : "todoId = :todoId and userId = :userId",
      ExpressionAttributeValues : {
        ":todoId": todoId,
        ":userId" : userId
      }
    }).promise()

  console.log('todoExists result: ', result)
  return result.Count == 1
}
