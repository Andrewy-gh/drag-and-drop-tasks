import React from 'react';
import ReactDOM from 'react-dom/client';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import { useState } from 'react';
import Column from './column';

const App = () => {
  const [data, setData] = useState(initialData);
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    // if destination and source are the same
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };
    console.log({ newColumn });
    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    };
    setData(newState);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
