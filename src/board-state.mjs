export const BOARD_STORAGE_KEY = "drag-and-drop-tasks.board";

const TODO_COLUMN_ID = "column-1";

export function addTodoToBoard(data, content) {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return data;
  }

  const taskId = createTaskId(data.tasks);
  const task = { id: taskId, content: trimmedContent };
  const todoColumn = data.columns[TODO_COLUMN_ID];

  return {
    ...data,
    tasks: {
      ...data.tasks,
      [taskId]: task,
    },
    columns: {
      ...data.columns,
      [TODO_COLUMN_ID]: {
        ...todoColumn,
        taskIds: [...todoColumn.taskIds, taskId],
      },
    },
  };
}

export function deleteTodoFromBoard(data, taskId) {
  if (!data.tasks[taskId]) {
    return data;
  }

  const { [taskId]: deletedTask, ...remainingTasks } = data.tasks;
  const columns = Object.fromEntries(
    Object.entries(data.columns).map(([columnId, column]) => [
      columnId,
      {
        ...column,
        taskIds: column.taskIds.filter((columnTaskId) => columnTaskId !== taskId),
      },
    ])
  );

  return {
    ...data,
    tasks: remainingTasks,
    columns,
  };
}

export function loadBoardData(defaultData, storage = getLocalStorage()) {
  if (!storage) {
    return defaultData;
  }

  try {
    const storedData = storage.getItem(BOARD_STORAGE_KEY);
    if (!storedData) {
      return defaultData;
    }

    const parsedData = JSON.parse(storedData);
    return isBoardData(parsedData) ? parsedData : defaultData;
  } catch {
    return defaultData;
  }
}

export function saveBoardData(data, storage = getLocalStorage()) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(BOARD_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Saving should never block the visible board update.
  }
}

function createTaskId(tasks) {
  const nextNumber =
    Math.max(
      0,
      ...Object.keys(tasks).map((taskId) => {
        const match = taskId.match(/^task-(\d+)$/);
        return match ? Number(match[1]) : 0;
      })
    ) + 1;

  return `task-${nextNumber}`;
}

function getLocalStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function isBoardData(data) {
  return (
    data &&
    typeof data === "object" &&
    isRecord(data.tasks) &&
    isRecord(data.columns) &&
    Array.isArray(data.columnOrder) &&
    data.columns[TODO_COLUMN_ID] &&
    Array.isArray(data.columns[TODO_COLUMN_ID].taskIds) &&
    data.columnOrder.every((columnId) => isColumn(data.columns[columnId]))
  );
}

function isRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isColumn(column) {
  return column && typeof column.id === "string" && Array.isArray(column.taskIds);
}
