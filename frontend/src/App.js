import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling

// Priority and Status Options
const priorityOptions = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
  { value: 4, label: 'Urgent' }
];

const statusOptions = [
  { value: 1, label: 'Draft' },
  { value: 2, label: 'In Progress' },
  { value: 3, label: 'On Hold' },
  { value: 4, label: 'Completed' },
  { value: 5, label: 'Deleted' }
];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority_id: 1, // default Low
    status_id: 1, // default Draft
    due_date: ''
  });
  const [editingTaskId, setEditingTaskId] = useState(null); // Track the task being edited

  // Fetch tasks from the backend
  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.log('Error fetching tasks:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all fields are filled
    if (!task.title || !task.description || !task.due_date || !task.priority_id || !task.status_id) {
      alert('Please fill in all the fields before submitting.');
      return;
    }
  
    try {
      const url = editingTaskId
        ? `http://localhost:5000/tasks/${editingTaskId}` // If editing, use PUT
        : 'http://localhost:5000/tasks'; // If adding, use POST
  
      const method = editingTaskId ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      const data = await response.json();
      if (response.ok) {
        if (editingTaskId) {
          setTasks(tasks.map(t => t.task_id === editingTaskId ? data : t)); // Update the task in the list
        } else {
          setTasks([...tasks, data]); // Add the new task
        }
        setTask({
          title: '',
          description: '',
          priority_id: 1,
          status_id: 1,
          due_date: ''
        });
        setEditingTaskId(null); // Reset editing state
      } else {
        console.log('Error submitting task:', data);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(t => t.task_id === taskId);
    setTask({
      title: taskToEdit.title,
      description: taskToEdit.description,
      priority_id: taskToEdit.priority_id,
      status_id: taskToEdit.status_id,
      due_date: taskToEdit.due_date
    });
    setEditingTaskId(taskId); // Set the task being edited
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null); // Cancel editing
    setTask({
      title: '',
      description: '',
      priority_id: 1,
      status_id: 1,
      due_date: ''
    });
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTasks(tasks.filter(t => t.task_id !== taskId)); // Remove the task from the list
      } else {
        console.log('Error deleting task');
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  // Determine color based on priority
  const getPriorityColor = (priorityId) => {
    switch (priorityId) {
      case 1:
        return '#d3ffd3'; // Low - light green
      case 2:
        return '#e1f7d5'; // Medium - lighter green
      case 3:
        return '#add8e6'; // High - light blue
      case 4:
        return '#ffcccb'; // Urgent - light red
      default:
        return '#f0f0f0'; // Default color for unassigned priority
    }
  };

  return (
    <div className="app-container">
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="input-field"
        />
        <input
          type="datetime-local"
          value={task.due_date}
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          className="input-field"
        />
        <select
          value={task.priority_id}
          onChange={(e) => setTask({ ...task, priority_id: parseInt(e.target.value) })}
          className="input-field"
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={task.status_id}
          onChange={(e) => setTask({ ...task, status_id: parseInt(e.target.value) })}
          className="input-field"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button type="submit" className="submit-button">{editingTaskId ? 'Update Task' : 'Add Task'}</button>
        {editingTaskId && (
          <button type="button" onClick={handleCancelEdit} className="cancel-button">Cancel</button>
        )}
      </form>

      <h2>Your Tasks</h2>
      <ul className="task-list">
        {tasks.map(t => (
          <li key={t.task_id} style={{ backgroundColor: getPriorityColor(t.priority_id) }} className="task-item">
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <p>Due Date: {new Date(t.due_date).toLocaleString()}</p>
            <p>Priority: {priorityOptions.find(p => p.value === t.priority_id)?.label}</p>
            <p>Status: {statusOptions.find(s => s.value === t.status_id)?.label}</p>
            <button onClick={() => handleEdit(t.task_id)}>Edit</button>
            <button onClick={() => handleDelete(t.task_id)}>Delete</button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
