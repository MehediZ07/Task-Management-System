import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useContext, useState, useEffect } from "react";
import Hero from "../Components/Hero";
import { AuthContext } from "../Providers/AuthProvider";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

  useEffect(() => {
    if (fetchedTasks) {
      setTasks({
        todo: fetchedTasks.filter((task) => task.status === "todo"),
        inProgress: fetchedTasks.filter((task) => task.status === "inProgress"),
        done: fetchedTasks.filter((task) => task.status === "done"),
      });
    }
  }, [fetchedTasks]);

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
      queryClient.invalidateQueries("task");
      setNewTask({
        name: "",
        description: "",
        technology: "",
        givenBy: "",
        deadline: "",
        status: "todo",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) {
      // ✅ Fix Reorder in the Same Group
      const reorderedTasks = Array.from(tasks[sourceColumn]);
      const [movedItem] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: reorderedTasks, // No copy issue
      }));
    } else {
      // ✅ Move Task Between Groups + Update MongoDB
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
        await axios.put(`http://localhost:5000/task/${movedItem._id}`, {
          status: destColumn,
        });
        queryClient.invalidateQueries("task");
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      <Hero />
      {user && (
        <>
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
          </div>
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
        </>
      )}
    </>
  );
}

export default Home;
