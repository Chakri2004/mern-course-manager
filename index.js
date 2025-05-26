const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  mongoose.connect(uri)
    .then(() => console.log("✅ In-memory MongoDB connected"))
    .catch((err) => console.error("❌ Connection error:", err));

  // Define schema
  const Course = mongoose.model("Course", new mongoose.Schema({
    title: String,
    description: String,
  }));

  // Routes
  app.get("/courses", async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
  });

  app.post("/courses", async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  });

  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
};

startServer();
