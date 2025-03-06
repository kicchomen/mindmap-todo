// Define common types for API interactions

export interface NotionTodo {
  id: string
  title: string
  completed: boolean
  parentId?: string
}

export interface NotionDatabase {
  id: string
  title: string
  todos: NotionTodo[]
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface SyncRequest {
  localTodos: Record<string, any>
  lastSyncTimestamp?: number
}

export interface SyncResponse {
  todos: Record<string, any>
  conflicts?: Record<string, any>
  timestamp: number
}