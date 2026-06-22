import { Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './task';

const Column = ({ column, tasks, index, onDeleteTodo }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <h3 className="column-title" {...provided.dragHandleProps}>
            {column.title}
          </h3>
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                className={`task-list${
                  snapshot.isDraggingOver ? ' task-list--dragging-over' : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    onDeleteTodo={onDeleteTodo}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
