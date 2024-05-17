import React, { useState, useRef, useEffect } from "react";
import "./App.css";

interface ITask {
  id: number;
  isDone: boolean;
  value: string;
  createdDate: number; // timestamp
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState<ITask[]>(() => {
    const tasksLocalStorage = localStorage.getItem("tasks");
    const hasLocalStorageValue =
      tasksLocalStorage && Array.isArray(JSON.parse(tasksLocalStorage!));

    return hasLocalStorageValue ? JSON.parse(tasksLocalStorage!) : [];
  });

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

  return (
    <div className="flex justify-center items-center">
      <div className="w-[400px] bg-red-400">
        <form onSubmit={handleAddTask}>
          <input
            required
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value;
              setInputValue(value);
            }}
          />
          <button type="submit">Add</button>
        </form>
        <div>
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex justify-between ${
                dragOverItem === index ? "bg-blue-300" : ""
              }`}
              draggable
              onDragStart={(event) => handleDragStart(event, task)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={(event) => handleDrop(event, index)}
            >
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onClick={() => handleTaskDone(task.id)}
                />
                <span>{task.value}</span>
              </div>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          ))}
          <div
            className={`flex justify-between ${
              dragOverItem === tasks.length ? "bg-blue-300" : ""
            }`}
            onDragOver={(event) => handleDragOver(event, tasks.length)}
            onDrop={(event) => handleDrop(event, tasks.length)}
            style={{ height: "2rem" }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
