// Environment configuration
export const config = {
  // Notion settings
  notionDatabaseId: '1ae66867cad080438e8cde0e96437268',
  
  // AI model settings
  aiModel: 'claude-3-7-sonnet-20250219',
  
  // API endpoints and keys are typically stored in environment variables
  // For now, we'll use placeholder values
  apiKey: import.meta.env.VITE_API_KEY || '',
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '',
}