# Drag and Drop tasks.

Kanban board that uses the `@hello-pangea/dnd` library. Tasks can be added, dragged into the appropriate section, and restored after reloads with local storage.

**Link to project:** https://dnd-task-app.netlify.app/
[![Video](https://github.com/Andy-git985/drag-and-drop-tasks/assets/17731837/b27e5962-db91-4afe-bbf3-d77a23de726a)]

## How to run the project:

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open the local URL printed by Vite, usually [http://localhost:5173](http://localhost:5173), to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `initial-data.js`

Feel to free to add and change data in this file.

## How It's Made:

**Tech used:** React with Vite, CSS, `@hello-pangea/dnd` library.

This app uses `@hello-pangea/dnd`, which allows the dragging and dropping of elements. It is a simple kanban board with a durable add-todo flow. CSS is kept very minimal.

## Optimizations

The app was moved from Create React App to Vite, swapped to the maintained `@hello-pangea/dnd` package, and removed `styled-components` so startup stays fast for a small board.
