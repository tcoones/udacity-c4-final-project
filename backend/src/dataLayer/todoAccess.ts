import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { S3Access } from './s3Access'

const s3 = new S3Access();

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.TODOS_S3_BUCKET)
    { }
        
    async getAllTodos(userId : string): Promise<TodoItem[]>{
        console.log("Getting all todo items for userid:" + userId)
        
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: " userId = :userId",
            ExpressionAttributeValues : {
              ":userId" : userId
            }
          }).promise()

        const items = result.Items;
        return items as TodoItem[]
    }

    async createNewTodo(newItem: CreateTodoRequest, todoId:string ,userId: string): Promise<TodoItem>{
        console.log("Creating a new todo item with todoId:" + todoId)

        const todo = {
            todoId: todoId,
            userId: userId,
            done: false,
            ...newItem
          }

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo as TodoItem;

    }

    async deleteTodo(todoId: string, userId: string ) : Promise <boolean>{
    
        console.log('Deleting todo item with todoId :' + todoId)

        try {
            await this.docClient.delete({
                TableName: this.todosTable,
                ConditionExpression: " todoId = :id AND userId  =:userId ",
                Key: {
                userId: userId,
                todoId: todoId
                },
                ExpressionAttributeValues: {
                ":id": todoId,
                ":userId": userId
                }
            }).promise()
            return true;
        } catch (error) {
            console.log("Error happened while deleting todoId:" + todoId, error)
            return false
        }
    }

    async updateTodo(updatedTodoItem: UpdateTodoRequest ,todoId:string, userId: string): Promise <boolean>{
        console.log("Updating todo item with todoId:" + todoId)

        try {
            await this.docClient.update({
                TableName: this.todosTable,
                Key : {
                    userId: userId,
                    todoId: todoId
                },
                ConditionExpression: "todoId = :todoId and userId = :userId",
                UpdateExpression: "set done = :done",
                ExpressionAttributeValues:{
                    ":done" : updatedTodoItem.done,
                    ":todoId" : todoId,
                    ":userId" : userId
                }
            }).promise()

            return true;
        } catch (error) {
            console.log("Error happened while updating todoId:" + todoId, error)
            return false;
        } 
    }

    async updateTodoAttachmentUrl(todoId: string, userId: string) : Promise<string>
    {
        console.log("Updating todo item attachment url with todoId:" + todoId)

        await this.updateUploadUrl(todoId,userId);

        return await s3.getUploadUrl(todoId);

    }

    async updateUploadUrl(todoId: string, userId: string) {
  
        const url =  `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
        
        try{
            await this.docClient.update({
                TableName: this.todosTable,
                Key : {
                    todoId: todoId,
                    userId: userId
                },
                ConditionExpression: "todoId = :todoId and userId = :userId",
                UpdateExpression: "set attachmentUrl = :url",
                ExpressionAttributeValues:{
                    ":url" : url,
                    ":todoId" : todoId,
                    ":userId" : userId
                }
            }).promise()
            console.log("Updating url done for todoId: " , todoId );
        }catch(e)
        {
            console.log("Error while generating signedURL", e)
        }
      }

}