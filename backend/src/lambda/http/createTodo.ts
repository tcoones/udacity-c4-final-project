import 'source-map-support/register'
import { createTodo } from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  const jwtToken = event.headers.Authorization.split(' ')[1]

  const todo = await createTodo(newTodoItem, jwtToken)

  console.log('Created Todo item:', {jwtToken, todoId: todo.todoId})

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: todo
    })
  }
}