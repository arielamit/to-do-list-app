// frontend/src/components/TaskForm.js
import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = () => {
    const [task, setTask] = useState({
        task_id: '',
        title: '',
        description: '',
        due_date: '',
        assigned_user_id: '',
        priority_id: 1,
        status_id: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/tasks', task)
            .then(response => console.log('Task added:', response))
            .catch(error => console.error('Error adding task:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" name="title" value={task.title} onChange={handleChange} />
            </label>
            <label>
                Description:
                <input type="text" name="description" value={task.description} onChange={handleChange} />
            </label>
            <label>
                Due Date:
                <input type="date" name="due_date" value={task.due_date} onChange={handleChange} />
            </label>
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;
