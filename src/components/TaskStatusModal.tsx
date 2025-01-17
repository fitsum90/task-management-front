import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Clock, AlertCircle } from "lucide-react";
import { updateTaskStatus, Task } from "../api/tasks";

interface TaskStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  newStatus: Task["status"];
}

const TaskStatusModal: React.FC<TaskStatusModalProps> = ({
  isOpen,
  onClose,
  task,
  newStatus: initialStatus,
}) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = React.useState("");
  const [selectedStatus, setSelectedStatus] =
    React.useState<Task["status"]>(initialStatus);

  const updateStatusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
      setComment("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusMutation.mutate({
      taskId: task._id,
      status: selectedStatus,
      comment: comment.trim() || undefined,
    });
  };

  if (!isOpen) return null;

  const statuses: Task["status"][] = ["TO_DO", "IN_PROGRESS", "DONE"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Update Task Status
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <Clock className="w-5 h-5" />
            <span>
              Current status:{" "}
              <span className="font-medium">
                {task.status.replace("_", " ")}
              </span>
            </span>
          </div>

          {selectedStatus === "DONE" && task.status !== "DONE" && (
            <div className="flex items-start space-x-2 bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <p className="text-sm">
                Please ensure all task requirements are met before marking as
                done.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as Task["status"])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment about this status change..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                updateStatusMutation.isPending || selectedStatus === task.status
              }
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskStatusModal;
