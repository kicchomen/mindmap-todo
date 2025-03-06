# MindMap TODO

A modern and intuitive mind map-based TODO management application that helps visualize task relationships and structure.

## Features

- Visualize tasks and subtasks in a mind map format
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Organize tasks hierarchically
- Collapse/expand branches to focus on specific parts of your task structure
- Dark/Light mode support
- Local storage persistence
- Modern, clean UI design

## Technology Stack

- **Core Technologies:**
  - TypeScript
  - Node.js
  - Anthropic Claude AI (claude-3-7-sonnet-20250219)

- **Frontend:**
  - React 19
  - Tailwind CSS
  - shadcn/ui components
  - React Flow (for mind map visualization)
  - Vite (for build and development)
  - Zustand (for state management)

## Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/kicchomen/mindmap-todo.git
   cd mindmap-todo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Future Enhancements

- Notion integration for cloud storage and synchronization
- AI-assisted task organization suggestions
- Enhanced collaboration features
- Mobile-optimized view
- Customizable themes and layouts
