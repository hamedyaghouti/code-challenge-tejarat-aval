import React from "react";
import "./App.css";

interface ITask {
  id: number;
  isDone: boolean;
  value: string;
  createdDate: number; //timestamp
}

function App() {
  const [inputValue, setInputValue] = React.useState("");
  const [tasks, setTasks] = React.useState<ITask[]>(() => {
    const tasksLocalStorage = localStorage.getItem("tasks");
    const hasLocalStorageValue =
      tasksLocalStorage && Array.isArray(JSON.parse(tasksLocalStorage!));

    return hasLocalStorageValue ? JSON.parse(tasksLocalStorage!) : [];
  });

  const isInitial = React.useRef(true);
  const draggedItem = React.useRef<ITask | null>(null);

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetTask: ITask
  ) => {
    event.preventDefault();
    const draggedTask = draggedItem.current;
    if (draggedTask) {
      const updatedTasks = tasks.filter((t) => t.id !== draggedTask.id);
      const dropIndex = updatedTasks.findIndex((t) => t.id === targetTask.id);
      updatedTasks.splice(dropIndex, 0, draggedTask);
      setTasks(updatedTasks);
    }
    draggedItem.current = null;
  };

  const handleDropEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const draggedTask = draggedItem.current;
    if (draggedTask) {
      const updatedTasks = tasks.filter((t) => t.id !== draggedTask.id);
      updatedTasks.push(draggedTask);
      setTasks(updatedTasks);
    }
    draggedItem.current = null;
  };

  React.useEffect(() => {
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
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between"
              draggable
              onDragStart={(event) => handleDragStart(event, task)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, task)}
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
            className="flex justify-between"
            onDragOver={(event) => handleDragOver(event)}
            onDrop={handleDropEnd}
            style={{ height: 10 }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
