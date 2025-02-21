import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddTask() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data: fetchedTasks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/task");
      return data;
    },
  });

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    technology: "",
    givenBy: "",
    deadline: "",
    user: user?.email || "", // Ensure it's available
    status: "todo",
  });

  // Handle adding a new task
  const addTask = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user?.email) {
      toast.error("Please login first!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Check for empty fields
    if (
      !newTask.name.trim() ||
      !newTask.description.trim() ||
      !newTask.technology.trim() ||
      !newTask.givenBy.trim() ||
      !newTask.deadline.trim()
    ) {
      toast.error("All fields are required!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      await axios.post(`http://localhost:5000/task`, newTask);
      queryClient.invalidateQueries(["task"]); // Refresh task list
      refetch();

      toast.success("Task added successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Reset form after submission
      setNewTask({
        name: "",
        description: "",
        technology: "",
        givenBy: "",
        deadline: "",
        user: user.email,
        status: "todo",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      {/* Add Task Form */}
      <div className="max-w-lg mx-auto mt-6 bg-violet-300 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Add a New Task
        </h2>
        <form onSubmit={addTask} className="space-y-4">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <input
            type="text"
            placeholder="Technology Stack (e.g., React, Node.js)"
            value={newTask.technology}
            onChange={(e) =>
              setNewTask({ ...newTask, technology: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <input
            type="text"
            placeholder="Task Given By (e.g., Manager, Client)"
            value={newTask.givenBy}
            onChange={(e) =>
              setNewTask({ ...newTask, givenBy: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({ ...newTask, deadline: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
