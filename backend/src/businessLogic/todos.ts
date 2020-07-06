import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId, todoExists } from '../auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess();

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]>{
    const userId = parseUserId(jwtToken)
    return await todoAccess.getAllTodos(userId)
}

export async function createTodo(newTodo: CreateTodoRequest, jwtToken: string ): Promise<TodoItem>{
    const userId = parseUserId(jwtToken)
    const itemId = uuid.v4()

    return await todoAccess.createNewTodo(newTodo, itemId, userId)
}

export async function deleteTodo(todoId:string, jwtToken: string): Promise<string>{
    const userId = parseUserId(jwtToken)
    const isTodoExist = todoExists(todoId,userId);

    // Lets check if todo exists
    if(!isTodoExist)
        return "NO_TODO";

    // if something goes wrong dataAccessLayer will return false so we did not assing to a const.
    return await todoAccess.deleteTodo(todoId,userId) == true ? "SUCCESS" : "ERROR"
}

export async function updateTodo(updatedTodoItem: UpdateTodoRequest, todoId: string, jwtToken: string):Promise<string>{

    const userId = parseUserId(jwtToken)
    const isTodoExist = todoExists(todoId,userId);

    // Lets check if todo exists
    if(!isTodoExist)
        return "NO_TODO";

    // if something goes wrong dataAccessLayer will return false so we did not assing to a const.
    return await todoAccess.updateTodo(updatedTodoItem,todoId,userId) == true ? "SUCCESS" : "ERROR"
}

export async function updateTodoAttachmentUrl(todoId:string, jwtToken: string): Promise<string>{
    const userId = parseUserId(jwtToken)
    const isTodoExist = todoExists(todoId,userId);

    // Lets check if todo exists
    if(!isTodoExist)
        return "NO_TODO";

    return await todoAccess.updateTodoAttachmentUrl(todoId,userId)
}