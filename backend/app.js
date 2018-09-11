
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const Task = require('./models/task');

const app = express();

mongoose.connect("mongodb+srv://pablo:" + process.env.MONGO_ATLAS_PW + "@cluster0-rc0u1.mongodb.net/node-angular?retryWrites=true")
.then(() => {
  console.log("Connected to DB");
})
.catch(() => {
  console.log("Connection to DB failed");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
//   next();
// });

app.post("/api/tasks", (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    content: req.body.content,
    duration: { min: req.body.duration.min, sec: req.body.duration.sec }
  });
  task.save().then(createdTask => {
    res.status(201).json({
      message: 'Task added successfully',
      taskId: createdTask._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a task failed',
      error: error
    });
  });
});

app.post("/api/tasks/prefill", (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    content: req.body.content,
    duration: { min: req.body.duration.min, sec: req.body.duration.sec },
    completion: { min: req.body.completion.min, sec: req.body.completion.sec },
    isCompleted: true,
    date: req.body.date
  });
  task.save().then(createdTask => {
    res.status(201).json({
      message: 'Prefill Task added successfully',
      taskId: createdTask._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a task failed',
      error: error
    });
  });
});

app.put("/api/tasks/:id", (req, res, next) => {
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    duration: { min: req.body.duration.min, sec: req.body.duration.sec }
  });
  Task.updateOne({ _id: req.params.id }, task).then(result => {
    res.status(200).json({ message: 'Update success' });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Updating task failed',
      error: error
    });
  });
});

app.put("/api/tasks/completed/:id", (req, res, next) => {
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    duration: { min: req.body.duration.min, sec: req.body.duration.sec },
    completion: { min: req.body.completion.min, sec: req.body.completion.sec },
    isCompleted: true,
    date: Date.now()
  });
  Task.updateOne({ _id: req.params.id }, task).then(result => {
    res.status(200).json({ message: 'Task saved as completed success' });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Saving task as completed failed',
      error: error
    });
  });
});

app.get("/api/tasks/completed", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find({ isCompleted: true })
  .sort({ date: -1 });
  let fetchedTasks;

  if (pageSize && currentPage) {
    taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  taskQuery.then(documents => {
    fetchedTasks = documents;
    return Task.count();
  }).then(count => {
    res.status(200).json({
      message: 'Completed Tasks fetched successfully',
      tasks: fetchedTasks,
      maxTasks: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Getting tasks failed',
      error: error
    });
  });
});

app.get("/api/tasks/productivity", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find({
    isCompleted: true,
    date: {
      $gte: new Date((new Date().getTime() - (8 * 24 * 60 * 60 * 1000)))
    }
  }).sort({ date: -1 });
  let fetchedTasks;

  if (pageSize && currentPage) {
    taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  taskQuery.then(documents => {
    fetchedTasks = documents;
    return Task.count();
  }).then(count => {
    res.status(200).json({
      message: 'Last week Completed Tasks fetched successfully',
      tasks: fetchedTasks,
      maxTasks: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Getting tasks failed',
      error: error
    });
  });
});

app.get("/api/tasks", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find({ isCompleted: false })
  .sort({ "duration.min": 1 });
  let fetchedTasks;

  if (pageSize && currentPage) {
    taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
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
  })
  .catch(error => {
    res.status(500).json({
      message: 'Getting tasks failed',
      error: error
    });
  });
});

app.get("/api/tasks/:id", (req, res, next) => {
  Task.findById(req.params.id).then(task => {
    if (task) {
      return res.status(200).json(task);
    } else {
      return res.status(404).json({ message: 'Task not found' });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Getting task failed',
      error: error
    });
  });
});

app.delete("/api/tasks/:id", (req, res, next) => {
  Task.deleteOne({ _id: req.params.id })
  .then(result => {
    res.status(200).json({ message: 'Task deleted' });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting task failed',
      error: error
    });
  });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
