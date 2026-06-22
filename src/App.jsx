import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./components/column";
import initialData from "./initial-data";
import {
  addTodoToBoard,
  deleteTodoFromBoard,
  loadBoardData,
  saveBoardData,
} from "./board-state.mjs";
import "./App.css";

const App = () => {
  const [data, setData] = useState(() => loadBoardData(initialData));
  const [todoContent, setTodoContent] = useState("");

  const commitData = (nextData) => {
    setData(nextData);
    saveBoardData(nextData);
  };

  const onAddTodo = (event) => {
    event.preventDefault();

    const nextData = addTodoToBoard(data, todoContent);
    if (nextData === data) {
      return;
    }

    commitData(nextData);
    setTodoContent("");
  };

  const onDeleteTodo = (taskId) => {
    const nextData = deleteTodoFromBoard(data, taskId);
    if (nextData === data) {
      return;
    }

    commitData(nextData);
  };

  const onDragStart = (start) => {
    document.body.style.color = "orange";
    document.body.style.transition = "background-color 0.2s ease";
  };

  const onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
      ? destination.index / Object.keys(data.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  };

  const onDragEnd = (result) => {
    document.body.style.color = "inherit";
    document.body.style.backgroundColor = "inherit";

    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };
      commitData(newState);
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      commitData(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    commitData(newState);
  };
  return (
    <>
      <form
        className="add-todo-form"
        onSubmit={onAddTodo}
        aria-label="Add new todo"
      >
        <label className="add-todo-label" htmlFor="new-todo">
          New todo
        </label>
        <input
          className="add-todo-input"
          id="new-todo"
          value={todoContent}
          onChange={(event) => setTodoContent(event.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add todo</button>
      </form>
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="columns-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];
                const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    onDeleteTodo={onDeleteTodo}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default App;
