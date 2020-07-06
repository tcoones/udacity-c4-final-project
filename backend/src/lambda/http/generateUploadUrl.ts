import 'source-map-support/register'
import { updateTodoAttachmentUrl } from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const jwtToken = event.headers.Authorization.split(' ')[1]
  
  const resultString = await updateTodoAttachmentUrl(todoId,jwtToken);
  
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
      body: 'Internal server error while processing updateattachmentUrl.'
    }
  } else{
    return {statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }, body: JSON.stringify({
        uploadUrl: resultString
      })
    }
  }  
}
