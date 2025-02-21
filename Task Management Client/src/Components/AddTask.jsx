import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddTask() {
  const queryClient = useQueryClient(); // ✅ Correct way to access the QueryClient

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    technology: "",
    givenBy: "",
    deadline: "",
    status: "todo",
  });

  const addTask = async (e) => {
    e.preventDefault();
    if (Object.values(newTask).some((val) => val.trim() === "")) return;

    try {
      await axios.post("http://localhost:5000/task", newTask);

      // ✅ Correctly invalidate the query using `useQueryClient`
      queryClient.invalidateQueries(["task"]);

      // ✅ Clear input fields
      setNewTask({
        name: "",
        description: "",
        technology: "",
        givenBy: "",
        deadline: "",
        status: "todo",
      });

      // ✅ Show success toast
      toast.success("Task added successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 bg-violet-300 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4 text-center text-white">
        Add a New Task
      </h2>
      <form onSubmit={addTask} className="space-y-4">
        {Object.keys(newTask).map(
          (key) =>
            key !== "status" && (
              <input
                key={key}
                type={key === "deadline" ? "date" : "text"}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={newTask[key]}
                onChange={(e) =>
                  setNewTask({ ...newTask, [key]: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                required
              />
            )
        )}
        <button
          type="submit"
          className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
      {/* ✅ Toast Container */}
      <ToastContainer />
    </div>
  );
}
