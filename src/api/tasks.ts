import axios from "axios";

const API_URL = "http://localhost:3000/api";

export interface StatusHistory {
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  comment?: string;
  changed_at: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  fileUrl?: string;
  created_at: string;
  status_history: StatusHistory[];
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (formData: FormData): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateTaskStatus = async ({
  taskId,
  status,
  comment,
}: {
  taskId: string;
  status: Task["status"];
  comment?: string;
}): Promise<Task> => {
  const response = await axios.patch(`${API_URL}/tasks/${taskId}/status`, {
    status,
    comment,
  });
  return response.data;
};

export const getTaskHistory = async (
  taskId: string
): Promise<StatusHistory[]> => {
  const response = await axios.get(`${API_URL}/tasks/${taskId}/history`);
  return response.data;
};
