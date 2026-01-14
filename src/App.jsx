import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Check, Layout, Calendar } from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask = {
      id: uuidv4(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="task-manager-app">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Stay organized and focused</p>
      </header>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="task-input"
        />
        <button type="submit" className="add-btn">
          <Plus size={20} />
          Add Task
        </button>
      </form>

      <div className="tabs">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button
          className={`tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content" onClick={() => toggleTask(task.id)}>
                <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && <Check size={14} color="white" />}
                </div>
                <span className="task-text">{task.text}</span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="delete-btn"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks found</h3>
            <p>Add a task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
