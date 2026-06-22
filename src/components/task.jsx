import { Draggable } from '@hello-pangea/dnd';

const Task = ({ task, index, onDeleteTodo }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task${snapshot.isDragging ? ' task--dragging' : ''}`}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="task-handle" {...provided.dragHandleProps} />
          <span className="task-content">{task.content}</span>
          <button
            className="delete-todo-button"
            type="button"
            onClick={() => onDeleteTodo(task.id)}
            aria-label={`Delete ${task.content}`}
          >
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
