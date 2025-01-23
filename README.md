# kanbanboard
**Drag-and-Drop Kanban Board**

1. **Set Up the Project**: Initialize a TypeScript React app using `create-react-app`. Install necessary libraries such as `react-beautiful-dnd` for drag-and-drop, `localforage` for storage, and `zod` for form validation.

2. **Design Basic Layout**: Create a simple UI with three columns (e.g., To-Do, In Progress, Done) and draggable task cards. Use CSS Flexbox or Grid for layout.

3. **Implement Drag-and-Drop**: Use `react-beautiful-dnd` to make task cards draggable between columns. Ensure smooth animations during dragging.

4. **Persistence**: Use `localStorage` or `localforage` to persist the board's state across sessions (task data, column order, etc.).

5. **Column Management**: Implement functionality to add, delete, and reorder columns dynamically.

6. **Keyboard Accessibility**: Ensure all drag-and-drop features are accessible using keyboard shortcuts (e.g., moving cards between columns using arrow keys).

7. **Unit Tests**: Write unit tests for components like the Board, Column, and Card to ensure they render and function as expected.

8. **Form Components Library**: Build reusable form components (text, select, radio buttons) with validation using `zod`. Implement form preview mode and JSON schema generation.

9. **Bonus Features**: Implement card search/filtering, undo/redo functionality, and optimize using `React.memo` and `useMemo` for performance.

10. **Integration Testing**: Write tests to ensure the full drag-and-drop and persistence functionality work together smoothly.


TO run code :

Extract project from github.

Install npm vite

npm run build
npm run preview