import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Kanban, List, Layout } from "lucide-react";
import TaskBoard from "./components/TaskBoard";
import TaskList from "./components/TaskList";
import TaskHeader from "./components/TaskHeader";
import CreateTaskModal from "./components/CreateTaskModal";

const queryClient = new QueryClient();

function App() {
  const [view, setView] = React.useState<"board" | "list">("board");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-3">
                <Layout className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Task Management
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView("board")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    view === "board"
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Kanban className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    view === "list"
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TaskHeader
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <div className="mt-6">
            {view === "board" ? (
              <TaskBoard
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
            ) : (
              <TaskList searchQuery={searchQuery} statusFilter={statusFilter} />
            )}
          </div>
        </main>

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
