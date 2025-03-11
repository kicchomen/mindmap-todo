# MindMap TODO

A modern and intuitive mind map-based TODO management application that helps visualize task relationships and structure.

## Features

- Visualize tasks and subtasks in a mind map format
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Organize tasks hierarchically
- Collapse/expand branches to focus on specific parts of your task structure
- **Automatic saving of changes to localStorage**
- **Export/import data functionality**
- Dark/Light mode support
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

## Data Management

The application automatically saves all changes to localStorage. This ensures that your mind map state is preserved between sessions. You can:

- **Auto-save**: All changes are automatically saved as you make them
- **Export data**: Export your entire mind map data as a JSON file for backup
- **Reset data**: Clear all data and start fresh if needed

This implementation is designed with future cloud storage support in mind, making it easy to integrate with services like Google Drive or iCloud in future versions.

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

- Google Drive, iCloud, and GitHub integration for cloud storage and synchronization
- Import functionality for restoring from exported data
- AI-assisted task organization suggestions
- Enhanced collaboration features
- Mobile-optimized view
- Customizable themes and layouts
