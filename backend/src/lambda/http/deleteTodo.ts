import 'source-map-support/register'
import { deleteTodo } from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const todoId = event.pathParameters.todoId
  const jwtToken = event.headers.Authorization.split(' ')[1]

  const resultString = await deleteTodo(todoId, jwtToken)

  if (resultString == "NO_TODO") {
    console.log("TODO NOT FOUND! todoId:" + todoId)    
    return { 
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  } else if (resultString == "ERROR"){
    console.log('Internal server error while processing delete Todo')

    return {
      statusCode: 500,
      body: 'Internal server error while processing delete Todo.'
    }
  } else{
    console.log('Deleted Todo item', { todoId })

    return {statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }, body: ''
    }
  }  
  
}
