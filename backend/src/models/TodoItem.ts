export interface TodoItem {
  userId: string
  todoId: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
