const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
// const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9yghi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// WebSocket Server
// const io = new Server(server, {
//     cors: { origin: "*" }
// });

// io.on("connection", (socket) => {
//     console.log("Client connected");
//     socket.on("disconnect", () => console.log("Client disconnected"));
// });

async function run() {
    try {
        // await client.connect();
        // console.log("Connected to MongoDB");

        const database = client.db('taskManagement');
        const taskCollection = database.collection('task');

        // Fetch all tasks
        // app.get('/task', async (req, res) => {
        //     try {
        //         const result = await taskCollection.find().toArray();
        //         res.send(result);
        //     } catch (error) {
        //         res.status(500).json({ error: "Failed to fetch tasks" });
        //     }
        // });


        app.get('/task', async (req, res) => {
            const { email } = req.query;
            
            try {
                const query = email ? { user: email } : {};
                const tasks = await taskCollection.find(query).toArray();
        
                // Add the creation time to each task
                tasks.forEach(task => {
                    task.createdAt = new ObjectId(task._id).getTimestamp();
                });
        
                res.send(tasks);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch tasks" });
            }
        });
        


        // app.get("/task", async (req, res) => {
        //     try {
        //       const tasks = await taskCollection.find().sort({ status: 1, position: 1 }); 
        //       res.json(tasks);
        //     } catch (error) {
        //       res.status(500).json({ error: "Failed to fetch tasks" });
        //     }
        //   });
          

        // app.put("/updateTaskOrder", async (req, res) => {
        //     try {
        //       const { tasksToUpdate } = req.body;
          
        //       // Bulk update tasks
        //       const bulkOps = tasksToUpdate.map((task) => ({
        //         updateOne: {
        //           filter: { _id: task._id },
        //           update: { $set: { position: task.position, status: task.status } },
        //         },
        //       }));
          
        //       await taskCollection.bulkWrite(bulkOps);
        //       res.status(200).json({ message: "Task order updated successfully" });
        //     } catch (error) {
        //       res.status(500).json({ error: "Failed to update task order" });
        //     }
        //   });
          

        // Fetch single task by ID
        app.get('/task/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await taskCollection.findOne(query);
                if (!result) return res.status(404).json({ error: "Task not found" });
                res.send(result);
            } catch (error) {
                res.status(500).json({ error: "Error retrieving task" });
            }
        });

        // Add a new task
        app.post('/task', async (req, res) => {
            try {
                const newTask = req.body;
                const result = await taskCollection.insertOne(newTask);
                io.emit("updateTasks");
                res.status(201).send(result);
            } catch (error) {
                res.status(500).json({ error: "Failed to add task" });
            }
        });

// Update task details (name, description, technology, etc.)
app.put('/taskedit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, technology, givenBy, deadline, status } = req.body;

        // Create an object with the updated fields
        const updatedTaskData = {
            name,
            description,
            technology,
            givenBy,
            deadline,
            status
        };

        // Update the task in the database
        const result = await taskCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedTaskData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Task not found or no changes made" });
        }

        // Emit an update event to notify the client (optional)
        io.emit("updateTasks");

        // Respond with a success message
        res.json({ message: "Task updated successfully" });
    } catch (error) {
        // console.error("Error updating task:", error);
        res.status(500).json({ error: "Error updating task" });
    }
});


        // Update task status
        app.put('/task/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const { status } = req.body;

                const result = await taskCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status } }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: "Task not found" });
                }

                io.emit("updateTasks");
                res.json({ message: "Task updated successfully" });
            } catch (error) {
                res.status(500).json({ error: "Error updating task" });
            }
        });

        app.put("/task/reorder", async (req, res) => {
            try {
              const bulkOps = req.body.tasks.map(({ _id, order }) => ({
                updateOne: {
                  filter: { _id },
                  update: { $set: { order } },
                },
              }));
          
              await Task.bulkWrite(bulkOps);
              res.status(200).json({ message: "Order updated successfully" });
            } catch (error) {
            //   console.error("Error updating order:", error);
              res.status(500).json({ error: "Failed to update task order" });
            }
          });
          
          

        // Delete a task
        app.delete('/task/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await taskCollection.deleteOne(query);

                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: "Task not found" });
                }

                io.emit("updateTasks");
                res.json({ message: "Task deleted successfully" });
            } catch (error) {
                res.status(500).json({ error: "Error deleting task" });
            }
        });

    } catch (error) {
        // console.error("MongoDB Connection Error:", error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task Manager Backend is Running');
});

server.listen(port);


// const onDragEnd = async (result) => {
//     if (!result.destination) return;

//     const { source, destination } = result;
//     const sourceColumn = source.droppableId;
//     const destColumn = destination.droppableId;

//     if (sourceColumn === destColumn) {
//       // ✅ Fix Reorder in the Same Group
//       const reorderedTasks = Array.from(tasks[sourceColumn]);
//       const [movedItem] = reorderedTasks.splice(source.index, 1);
//       reorderedTasks.splice(destination.index, 0, movedItem);

//       setTasks((prev) => ({
//         ...prev,
//         [sourceColumn]: reorderedTasks, // No copy issue
//       }));
//     } else {
//       // ✅ Move Task Between Groups + Update MongoDB
//       const sourceTasks = Array.from(tasks[sourceColumn]);
//       const destinationTasks = Array.from(tasks[destColumn]);

//       const [movedItem] = sourceTasks.splice(source.index, 1);
//       movedItem.status = destColumn;
//       destinationTasks.splice(destination.index, 0, movedItem);

//       setTasks((prev) => ({
//         ...prev,
//         [sourceColumn]: sourceTasks,
//         [destColumn]: destinationTasks,
//       }));

//       try {
//         await axios.put(`http://localhost:5000/task/${movedItem._id}`, {
//           status: destColumn,
//         });
//         queryClient.invalidateQueries("task");
//       } catch (error) {
//         console.error("Error updating task status:", error);
//       }
//     }
//   };