import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 8080;
const atlas_url = "******";

mongoose
  .connect(atlas_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
  deleted: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

app.use(cors({ origin: "*" }), express.json());

app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving tasks", error });
  }
});

app.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(200).send(savedTask);
  } catch (error) {
    res.status(500).send("Error adding new task:", error);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTask = req.body;
    const result = await Task.findByIdAndUpdate(taskId, updatedTask, {
      new: true,
    });
    res.json(result);
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .send({ message: "Error updating task:", error: error.message });
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
