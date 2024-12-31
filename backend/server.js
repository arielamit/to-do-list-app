const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Path to the tasks JSON file
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Helper function to read tasks from the JSON file
const readTasksFromFile = () => {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading tasks from file:', err);
    return [];
  }
};

// Helper function to write tasks to the JSON file
const writeTasksToFile = (tasks) => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing tasks to file:', err);
  }
};

// CRUD Routes

// GET all tasks sorted by priority
app.get('/tasks', (req, res) => {
  const tasks = readTasksFromFile();
  // Sort tasks by priority (Urgent -> Low)
  tasks.sort((a, b) => b.priority_id - a.priority_id);
  res.json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
  const tasks = readTasksFromFile();
  const newTask = { 
    ...req.body, 
    task_id: tasks.length + 1, 
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasksToFile(tasks);
  res.status(201).json(newTask);
});

// PUT (update) a task
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasksFromFile();
  const taskIndex = tasks.findIndex(task => task.task_id === parseInt(req.params.id));
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = { 
      ...tasks[taskIndex], 
      ...req.body, 
      update_date: new Date().toISOString() 
    };
    writeTasksToFile(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasksFromFile();
  const updatedTasks = tasks.filter(task => task.task_id !== parseInt(req.params.id));
  writeTasksToFile(updatedTasks);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
