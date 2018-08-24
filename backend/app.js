
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
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

app.put("/api/tasks/:id", (req, res, next) => {
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Task.updateOne({ _id: req.params.id }, task).then(result => {
    res.status(200).json({ message: 'update success' });
  });
});

app.get("/api/tasks", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find();
  let fetchedTasks;

  if (pageSize && currentPage) {
    taskQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  taskQuery.then(documents => {
    fetchedTasks = documents;
    return Task.count();
  }).then(count => {
    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks: fetchedTasks,
      maxTasks: count
    });
  });
});

app.get("/api/tasks/:id", (req, res, next) => {
  Task.findById(req.params.id).then(post => {
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ message: 'Task not found' });
    }
  });
});

app.delete("/api/tasks/:id", (req, res, next) => {
  Task.deleteOne({ _id: req.params.id })
  .then(result => {
    res.status(200).json({ message: 'Task deleted' });
  });
});

module.exports = app;
