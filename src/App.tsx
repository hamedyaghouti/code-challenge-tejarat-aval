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
  const [showActive, setShowActive] = useState(false);

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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, task: ITask) => {
    draggedItem.current = task;
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    setDragOverItem(index);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const draggedTask = draggedItem.current;
    if (draggedTask) {
      const updatedTasks = tasks.filter(t => t.id !== draggedTask.id);
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

  const filteredTasks = showActive ? tasks.filter(task => !task.isDone) : tasks;

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
            onClick={() => setShowActive(!showActive)}
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
        <div>
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex justify-between items-center p-2 border rounded-md mb-2 ${dragOverItem === index ? "bg-blue-100" : "bg-white"}`}
              draggable
              onDragStart={(event) => handleDragStart(event, task)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDrop={(event) => handleDrop(event, index)}
            >
              <div className="flex gap-4 items-center">
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onClick={() => handleTaskDone(task.id)}
                  className="form-checkbox h-5 w-5"
                />
                <span className={`${task.isDone ? "line-through text-gray-500" : "text-black"}`}>{task.value}</span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
