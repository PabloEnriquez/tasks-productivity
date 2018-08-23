
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Task = require('./models/task');

const app = express();

mongoose.connect("mongodb+srv://pablo:zcsaxao023ZAikbx@cluster0-rc0u1.mongodb.net/node-angular?retryWrites=true")
.then(() => {
  console.log("Connected to DB");
})
.catch(() => {
  console.log("Connection to DB failed");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/tasks", (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    content: req.body.content
  });
  task.save().then(createdTask => {
    res.status(201).json({
      message: 'Task added successfully',
      taskId: createdTask._id
    });
  });
});

app.get("/api/tasks", (req, res, next) => {
  Task.find()
    .then(documents => {
      res.status(200).json({
        message: 'Task fetched successfully',
        tasks: documents
      });
    });
});

app.delete("/api/tasks/:id", (req, res, next) => {
  Task.deleteOne({ _id: req.params.id })
  .then(result => {
    res.status(200).json({ message: 'Task deleted' });
  });
});

module.exports = app;
