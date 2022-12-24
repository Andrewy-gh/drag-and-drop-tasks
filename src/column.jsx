import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;

  // removed for horizontal lists
  // width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transiton: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};

  // removed for horizontal lists
  // flex-grow: 1;
  // min-height: 100px;

  // added horizontal lists exercise
  display: flex;
`;
const Column = ({ column, tasks, isDropDisabled }) => {
  return (
    <>
      <Container>
        <Title>{column.title}</Title>
        <Droppable
          droppableId={column.id}
          // 1st mechanism to control droppable allows to drop in columns except column-3
          // type={column.id === 'column-3' ? 'done' : 'active'}

          // 2nd mechanism to prevent dropping
          isDropDisabled={isDropDisabled}
          // horizontal dropping
          direction="horizontal"
        >
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    </>
  );
};

export default Column;
