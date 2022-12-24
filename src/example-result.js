const result = {
  draggableId: 'task-1',
  type: 'TYPE',
  reason: 'DROP', // DROP or CANCEL
  source: {
    droppableId: 'column-1',
    index: 0,
  },
  destination: {
    droppableId: 'column-1',
    index: 1,
    // destination can be null, when user drops outside an area
  },
};
