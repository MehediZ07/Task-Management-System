import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Hero from "../Components/Hero";
import { AuthContext } from "../Providers/AuthProvider";

function Home() {
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

  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });

  // Modal state for Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    technology: "",
    givenBy: "",
    deadline: "",
    status: "todo",
  });

  useEffect(() => {
    if (fetchedTasks) {
      setTasks({
        todo: fetchedTasks.filter((task) => task.status === "todo"),
        inProgress: fetchedTasks.filter((task) => task.status === "inProgress"),
        done: fetchedTasks.filter((task) => task.status === "done"),
      });
    }
  }, [fetchedTasks]);

  // Handle editing
  const handleEdit = (task) => {
    setEditedTask({
      name: task.name,
      description: task.description,
      technology: task.technology,
      givenBy: task.givenBy,
      deadline: task.deadline,
      status: task.status,
    });
    setShowEditModal(true);
  };

  // Handle submitting the edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/task/${editedTask._id}`,
        editedTask
      );
      queryClient.invalidateQueries("task");
      setShowEditModal(false); // Close the modal after edit

      toast.success("Task updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:5000/task/${_id}`);
      refetch(); // Refresh tasks list
      toast.success("Delete Successfully.");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Error deleting task");
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      <Hero />
      {user && (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 p-10 mx-auto w-full min-h-screen">
              {Object.entries(tasks).map(([columnId, columnTasks]) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-100 p-4 w-80 rounded-lg shadow-md"
                    >
                      <h2 className="text-lg font-bold mb-2 capitalize">
                        {columnId}
                      </h2>
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-700 p-4 mb-2 rounded shadow text-sm"
                            >
                              <strong className="text-white">
                                {task.name}
                              </strong>
                              <p className="text-gray-400">
                                {task.description}
                              </p>
                              <span className="text-xs text-blue-300">
                                {task.technology}
                              </span>
                              <p className="text-xs text-yellow-400">
                                Given by: {task.givenBy}
                              </p>
                              <p className="text-xs text-red-400">
                                Deadline: {task.deadline}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(task)}
                                  className="btn"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className="btn"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>

          {/* Modal for Edit */}
          {showEditModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Edit Task
                </h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {Object.keys(editedTask).map(
                    (key) =>
                      key !== "_id" &&
                      key !== "status" && (
                        <input
                          key={key}
                          type={key === "deadline" ? "date" : "text"}
                          placeholder={
                            key.charAt(0).toUpperCase() + key.slice(1)
                          }
                          value={editedTask[key]}
                          onChange={(e) =>
                            setEditedTask({
                              ...editedTask,
                              [key]: e.target.value,
                            })
                          }
                          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                          required
                        />
                      )
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
                    >
                      Update Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="bg-red-500 w-full py-2 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      <ToastContainer />
    </>
  );
}

export default Home;
