import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { AuthContext } from "../Providers/AuthProvider";
import { FaEdit } from "react-icons/fa";

import { MdDeleteForever } from "react-icons/md";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://task-management-server-brown-three.vercel.app/task"
      );
      return data;
    },
  });

  const fetchedTasks = data.filter((task) => task.user === user?.email);

  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  console.log(tasks);
  // Modal state for Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState({
    _id: "",
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
  }, [fetchedTasks, data]);

  // Handle editing
  const handleEdit = (task) => {
    console.log("Editing task", task); // Debugging line
    setEditedTask({
      _id: task._id,
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
        `https://task-management-server-brown-three.vercel.app/taskedit/${editedTask._id}`,
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
      await axios.delete(
        `https://task-management-server-brown-three.vercel.app/${_id}`
      );
      refetch(); // Refresh tasks list
      toast.success("Delete Successfully.");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Error deleting task");
    }
  };

  // Handle the drag and drop logic
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) {
      // Reorder within the same column
      const reorderedTasks = Array.from(tasks[sourceColumn]);
      const [movedItem] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: reorderedTasks,
      }));
    } else {
      // Move task between columns and update status in backend
      const sourceTasks = Array.from(tasks[sourceColumn]);
      const destinationTasks = Array.from(tasks[destColumn]);

      const [movedItem] = sourceTasks.splice(source.index, 1);
      movedItem.status = destColumn;
      destinationTasks.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destColumn]: destinationTasks,
      }));

      try {
        await axios.put(
          `https://task-management-server-brown-three.vercel.app/${movedItem._id}`,
          {
            status: destColumn,
          }
        );
        queryClient.invalidateQueries("task");
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  // const onDragEnd = async (result) => {
  //   if (!result.destination) return; // If dropped outside a valid area, do nothing

  //   const { source, destination } = result;
  //   const sourceColumn = source.droppableId;
  //   const destColumn = destination.droppableId;

  //   // Clone current tasks
  //   const updatedTasks = { ...tasks };

  //   if (sourceColumn === destColumn) {
  //     // Reorder within the same column
  //     const reorderedTasks = Array.from(tasks[sourceColumn]);
  //     const [movedItem] = reorderedTasks.splice(source.index, 1);
  //     reorderedTasks.splice(destination.index, 0, movedItem);

  //     // Update the state
  //     updatedTasks[sourceColumn] = reorderedTasks;
  //   } else {
  //     // Move task between columns
  //     const sourceTasks = Array.from(tasks[sourceColumn]);
  //     const destinationTasks = Array.from(tasks[destColumn]);

  //     const [movedItem] = sourceTasks.splice(source.index, 1);
  //     movedItem.status = destColumn; // Change the status of the moved task
  //     destinationTasks.splice(destination.index, 0, movedItem);

  //     updatedTasks[sourceColumn] = sourceTasks;
  //     updatedTasks[destColumn] = destinationTasks;
  //   }

  //   // Update frontend state
  //   setTasks(updatedTasks);

  //   // Prepare data to send to backend
  //   const tasksToUpdate = [
  //     ...updatedTasks[sourceColumn].map((task, index) => ({
  //       _id: task._id,
  //       status: sourceColumn,
  //       position: index,
  //     })),
  //     ...updatedTasks[destColumn].map((task, index) => ({
  //       _id: task._id,
  //       status: destColumn,
  //       position: index,
  //     })),
  //   ];

  //   try {
  //     await axios.put("https://task-management-server-brown-three.vercel.app/updateTaskOrder", {
  //       tasksToUpdate,
  //     });
  //     queryClient.invalidateQueries("task");
  //   } catch (error) {
  //     console.error("Error updating task order:", error);
  //   }
  // };

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      {user && (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center  p-10 mx-auto w-full min-h-screen">
              {Object.entries(tasks).map(([columnId, columnTasks]) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-100 p-4 w-80 min-h-[200px] rounded-lg shadow-md"
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
                              <p className="text-xs text-green-400">
                                {new Date(task.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
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
                                  className="font-semibold p-2 text-green-400"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className="font-semibold p-2 text-red-600"
                                >
                                  <MdDeleteForever />
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

export default Dashboard;
