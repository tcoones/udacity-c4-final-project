import 'source-map-support/register'
import { updateTodo } from '../../businessLogic/todos'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodoItem: UpdateTodoRequest = JSON.parse(event.body)
  const jwtToken = event.headers.Authorization.split(' ')[1]
  
  const resultString = await updateTodo(updatedTodoItem,todoId,jwtToken);

  if (resultString == "NO_TODO") {
    console.log("TODO NOT FOUND! todoId:" + todoId)    
    return { 
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  } else if (resultString == "ERROR"){
    return {
      statusCode: 500,
      body: 'Internal server error while processing update done Todo.'
    }
  } else{
    return {statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }, body: ''
    }
  }  
  
}