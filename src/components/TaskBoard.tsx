import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { FileUp, Clock, Calendar, Tag, History } from "lucide-react";
import { fetchTasks, Task } from "../api/tasks";
import TaskStatusModal from "./TaskStatusModal";

interface TaskBoardProps {
  searchQuery: string;
  statusFilter: string;
}

// Define a type for possible task statuses
type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE";

const TaskBoard: React.FC<TaskBoardProps> = ({ searchQuery, statusFilter }) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const [statusModal, setStatusModal] = React.useState<{
    isOpen: boolean;
    task?: Task;
    newStatus?: Task["status"];
  }>({
    isOpen: false,
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Remove 'task-' prefix to get the actual task ID
    const taskId = result.draggableId.replace("task-", "");
    const newStatus = result.destination.droppableId as TaskStatus; // Cast to TaskStatus
    const task = tasks?.find((t) => t._id === taskId);

    if (task && task.status !== newStatus) {
      setStatusModal({
        isOpen: true,
        task,
        newStatus,
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setStatusModal({
      isOpen: true,
      task,
      newStatus: task.status,
    });
  };

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const columns: Record<TaskStatus, Task[]> = {
    TO_DO: filteredTasks?.filter((task) => task.status === "TO_DO") || [],
    IN_PROGRESS:
      filteredTasks?.filter((task) => task.status === "IN_PROGRESS") || [],
    DONE: filteredTasks?.filter((task) => task.status === "DONE") || [],
  };

  const columnStyles: Record<TaskStatus, string> = {
    TO_DO: "bg-red-50 border-red-200",
    IN_PROGRESS: "bg-yellow-50 border-yellow-200",
    DONE: "bg-green-50 border-green-200",
  };

  const statusColors: Record<TaskStatus, string> = {
    TO_DO: "text-red-600 bg-red-50",
    IN_PROGRESS: "text-yellow-600 bg-yellow-50",
    DONE: "text-green-600 bg-green-50",
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([status, tasks]) => (
            <div
              key={status}
              className={`rounded-lg border ${
                columnStyles[status as TaskStatus]
              } p-4 shadow-sm`}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                {status.replace("_", " ")}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({tasks.length})
                </span>
              </h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 min-h-[200px]"
                  >
                    {tasks.map((task, index) => {
                      const draggableId = `task-${task._id}`;
                      return (
                        <Draggable
                          key={draggableId}
                          draggableId={draggableId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleTaskClick(task)}
                              className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md ${
                                snapshot.isDragging ? "shadow-lg scale-105" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-gray-900">
                                  {task.title}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {task.status_history?.length > 1 && (
                                    <button
                                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                      title="View status history"
                                    >
                                      <History className="w-4 h-4 text-gray-400" />
                                    </button>
                                  )}
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      statusColors[task.status as TaskStatus]
                                    }`}
                                  >
                                    {task.status.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {task.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(
                                      task.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(
                                      task.created_at
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                                {task.fileUrl && (
                                  <a
                                    href={task.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                  >
                                    <FileUp className="w-4 h-4 mr-1" />
                                    View
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {statusModal.isOpen && statusModal.task && (
        <TaskStatusModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal({ isOpen: false })}
          task={statusModal.task}
          newStatus={statusModal.newStatus || statusModal.task.status}
        />
      )}
    </>
  );
};

export default TaskBoard;
