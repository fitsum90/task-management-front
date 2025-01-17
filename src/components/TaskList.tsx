import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FileUp, Calendar, Clock, Tag } from "lucide-react";
import { fetchTasks } from "../api/tasks";

interface TaskListProps {
  searchQuery: string;
  statusFilter: string;
}

const TaskList: React.FC<TaskListProps> = ({ searchQuery, statusFilter }) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    TO_DO: "text-red-600 bg-red-50 border-red-200",
    IN_PROGRESS: "text-yellow-600 bg-yellow-50 border-yellow-200",
    DONE: "text-green-600 bg-green-50 border-green-200",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks?.map((task) => (
        <div
          key={task._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {task.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    statusColors[task.status]
                  }`}
                >
                  {task.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{task.description}</p>
            </div>
            {task.fileUrl && (
              <a
                href={task.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors ml-4"
              >
                <FileUp className="w-5 h-5" />
              </a>
            )}
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(task.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {new Date(task.created_at).toLocaleTimeString()}
            </span>
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>
      ))}
      {filteredTasks?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
