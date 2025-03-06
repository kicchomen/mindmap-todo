import { config } from './config'
import { APIResponse, NotionTodo, SyncRequest, SyncResponse } from './types'
import { TodoNode } from '../store'

class APIClient {
  private readonly aiModel: string = config.aiModel
  
  constructor() {
    // Initialize with the configuration
    console.log(`Initializing API client with AI model: ${this.aiModel}`)
  }
  
  /**
   * Fetches todos from Notion database
   */
  async fetchTodosFromNotion(): Promise<APIResponse<NotionTodo[]>> {
    try {
      // For now, this is a placeholder for actual Notion API integration
      // In a real implementation, this would fetch data from Notion API
      console.log(`Fetching todos from Notion database: ${config.notionDatabaseId}`)
      
      // Mock response
      return {
        success: true,
        data: [
          {
            id: 'notion-1',
            title: 'Task from Notion',
            completed: false
          }
        ]
      }
    } catch (error) {
      console.error('Error fetching todos from Notion:', error)
      return {
        success: false,
        error: 'Failed to fetch todos from Notion'
      }
    }
  }
  
  /**
   * Syncs local todos with Notion
   */
  async syncWithNotion(request: SyncRequest): Promise<APIResponse<SyncResponse>> {
    try {
      // This would be an actual sync implementation in a real app
      console.log('Syncing todos with Notion database')
      
      // Mock response
      return {
        success: true,
        data: {
          todos: request.localTodos,
          timestamp: Date.now()
        }
      }
    } catch (error) {
      console.error('Error syncing with Notion:', error)
      return {
        success: false,
        error: 'Failed to sync with Notion'
      }
    }
  }
  
  /**
   * Uses AI to suggest organization of todos
   */
  async suggestTodoOrganization(todos: Record<string, TodoNode>): Promise<APIResponse<Record<string, TodoNode>>> {
    try {
      console.log(`Using AI model ${this.aiModel} to suggest todo organization`)
      
      // This would call the Claude API in a real implementation
      // For now, return the same structure
      return {
        success: true,
        data: todos
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
      return {
        success: false,
        error: 'Failed to get AI suggestions'
      }
    }
  }
}

// Export a singleton instance
export const apiClient = new APIClient()