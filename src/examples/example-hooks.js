// onDragStart
const start = {
  draggableId: 'task-1',
  type: 'TYPE',
  source: {
    droppableId: 'column-1',
    index: 0,
  },
};

// onDragUpdate
// current location of the draggable in the system
const update = {
  ...start,
  destination: {
    droppableId: 'column-1',
    index: 1,
  },
};

// onDragEnd
const result = {
  ...update,
  reason: 'DROP',
};
