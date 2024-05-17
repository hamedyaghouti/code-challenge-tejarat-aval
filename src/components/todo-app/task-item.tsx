import { formatDate } from "@/utils/helpers";

interface ITaskItemProps {
  task: ITask;
  index: number;
  isDragOverItem: boolean;
  handleDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    task: ITask
  ) => void;
  handleDragOver: (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleTaskDone: (id: number) => void;
  showDates: boolean;
  handleDeleteTask: (id: number) => void;
}

export const TaskItem = ({
  task,
  index,
  isDragOverItem,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleTaskDone,
  showDates,
  handleDeleteTask,
}: ITaskItemProps) => {
  return (
    <div
      key={task.id}
      className={`flex justify-between items-center p-2 border rounded-md mb-2 ${
        isDragOverItem ? "bg-blue-100" : "bg-white"
      }`}
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
        <span
          className={`${
            task.isDone ? "line-through text-gray-500" : "text-black"
          }`}
        >
          {task.value}
        </span>
      </div>
      {showDates && (
        <div>
          <p className="text-gray-500 text-sm">
            {formatDate(task.createdDate)}
          </p>
        </div>
      )}
      <button
        onClick={() => handleDeleteTask(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};
