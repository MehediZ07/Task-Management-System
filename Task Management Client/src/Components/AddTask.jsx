import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    technology: "",
    givenBy: "",
    deadline: "",
    user: user?.email || "", // Ensures it's always defined
    status: "todo",
    createdAt: new Date().toISOString(),
  });

  // Handle adding a new task
  const addTask = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      return toast.error("Please login first!", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    if (Object.values(newTask).some((val) => !val.trim())) {
      return toast.error("All fields are required!", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    try {
      await axios.post(
        "https://task-management-server-brown-three.vercel.app/task",
        newTask
      );

      toast.success("Task added successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Reset form
      setNewTask({
        name: "",
        description: "",
        technology: "",
        givenBy: "",
        deadline: "",
        user: user?.email || "",
        status: "todo",
      });
      navigate("/dashboard");
    } catch (error) {
      setNewTask({
        name: "",
        description: "",
        technology: "",
        givenBy: "",
        deadline: "",
        user: user?.email || "",
        status: "todo",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div>
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
          <div className="flex items-center gap-2">
            <label className="bg-gray-700 p-[.6rem] text-white rounded-[.25rem]">
              Deadline
            </label>
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) =>
                setNewTask({ ...newTask, deadline: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-violet-400 w-full py-2 text-black font-semibold rounded hover:bg-violet-500"
          >
            Add Task
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
