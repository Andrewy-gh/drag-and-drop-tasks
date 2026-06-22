import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BOARD_STORAGE_KEY,
  addTodoToBoard,
  deleteTodoFromBoard,
  loadBoardData,
  saveBoardData,
} from "./board-state.mjs";

const defaultData = {
  tasks: {
    "task-1": { id: "task-1", content: "Existing task" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1"],
    },
    "column-2": {
      id: "column-2",
      title: "In progress",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2"],
};

describe("board state", () => {
  it("adds a trimmed todo to the To do column", () => {
    const nextData = addTodoToBoard(defaultData, "  Write tests  ");

    assert.equal(nextData.tasks["task-2"].content, "Write tests");
    assert.deepEqual(nextData.columns["column-1"].taskIds, [
      "task-1",
      "task-2",
    ]);
  });

  it("does not add an empty todo", () => {
    const nextData = addTodoToBoard(defaultData, "   ");

    assert.equal(nextData, defaultData);
  });

  it("deletes a todo from tasks and every column", () => {
    const data = {
      ...defaultData,
      columns: {
        ...defaultData.columns,
        "column-2": {
          ...defaultData.columns["column-2"],
          taskIds: ["task-1"],
        },
      },
    };

    const nextData = deleteTodoFromBoard(data, "task-1");

    assert.equal(nextData.tasks["task-1"], undefined);
    assert.deepEqual(nextData.columns["column-1"].taskIds, []);
    assert.deepEqual(nextData.columns["column-2"].taskIds, []);
  });

  it("does not change board data when deleting a missing todo", () => {
    const nextData = deleteTodoFromBoard(defaultData, "task-missing");

    assert.equal(nextData, defaultData);
  });

  it("saves and restores persisted board data", () => {
    const storage = createStorage();
    const savedData = addTodoToBoard(defaultData, "Persist me");

    saveBoardData(savedData, storage);

    assert.deepEqual(loadBoardData(defaultData, storage), savedData);
  });

  it("falls back to default data when stored JSON is invalid", () => {
    const storage = createStorage();
    storage.setItem(BOARD_STORAGE_KEY, "{bad json");

    assert.equal(loadBoardData(defaultData, storage), defaultData);
  });

  it("falls back to default data when stored board data is incomplete", () => {
    const storage = createStorage();
    storage.setItem(
      BOARD_STORAGE_KEY,
      JSON.stringify({ tasks: {}, columns: {}, columnOrder: [] })
    );

    assert.equal(loadBoardData(defaultData, storage), defaultData);
  });
});

function createStorage() {
  const items = new Map();

  return {
    getItem(key) {
      return items.has(key) ? items.get(key) : null;
    },
    setItem(key, value) {
      items.set(key, value);
    },
  };
}
