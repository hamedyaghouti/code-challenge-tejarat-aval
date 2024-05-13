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
            <div key={task.id} className="flex justify-between">
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
        </div>
      </div>
    </div>
  );
}

export default App;
