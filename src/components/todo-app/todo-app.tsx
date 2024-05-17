import React, { useState, useRef, useEffect } from "react";

import { useLocalStorage } from "../../hooks";
import { TaskItem } from "./task-item";

const useTodoApp = () => {
  const [inputValue, setInputValue] = useState("");
  const { value: tasks, setValue: setTasks } = useLocalStorage<ITask[]>(
    "tasks",
    []
  );
  const { value: showActive, setValue: setShowActive } =
    useLocalStorage<boolean>("showActiveTask", false);
  const { value: showDates, setValue: setShowDates } = useLocalStorage<boolean>(
    "showTaskDates",
    true
  );

  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const isInitial = useRef(true);
  const draggedItem = useRef<ITask | null>(null);

  const handleTaskDone = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: number) =>
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

  const handleDeleteDoneTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.isDone));
  };

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const task: ITask = {
      id: Date.now(),
      isDone: false,
      value: inputValue,
      createdDate: Date.now(),
    };

    setInputValue("");
    setTasks((prevState) => [...prevState, task]);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    task: ITask
  ) => {
    draggedItem.current = task;
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    setDragOverItem(index);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    const draggedTask = draggedItem.current;
    if (draggedTask) {
      const updatedTasks = tasks.filter((t) => t.id !== draggedTask.id);
      updatedTasks.splice(index, 0, draggedTask);
      setTasks(updatedTasks);
    }
    setDragOverItem(null);
    draggedItem.current = null;
  };

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
    } else {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const filteredTasks = showActive
    ? tasks.filter((task) => !task.isDone)
    : tasks;

  return {
    handleAddTask,
    inputValue,
    setInputValue,
    setShowActive,
    showActive,
    handleDeleteDoneTasks,
    showDates,
    setShowDates,
    filteredTasks,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleTaskDone,
    handleDeleteTask,
  };
};

export const TodoApp = () => {
  const {
    handleAddTask,
    inputValue,
    setInputValue,
    setShowActive,
    showActive,
    handleDeleteDoneTasks,
    showDates,
    setShowDates,
    filteredTasks,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleTaskDone,
    handleDeleteTask,
  } = useTodoApp();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[400px] bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleAddTask} className="mb-4">
          <input
            required
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value;
              setInputValue(value);
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Add a new task"
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </form>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setShowActive((prevState) => !prevState)}
            className="w-[48%] bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            {showActive ? "Show All Tasks" : "Show Active Tasks"}
          </button>
          <button
            onClick={handleDeleteDoneTasks}
            className="w-[48%] bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Delete Done Tasks
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500"
              checked={showDates}
              onChange={() => setShowDates((prevState) => !prevState)}
            />
            <span className="ml-2">Show Dates</span>
          </label>
        </div>
        <div>
          {filteredTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              isDragOverItem={dragOverItem === index}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleTaskDone={handleTaskDone}
              showDates={showDates}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
