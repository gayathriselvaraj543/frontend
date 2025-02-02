import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskList from './TaskList';
import AddTask from './AddTask';
import ProgressChart from './ProgressChart';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0
  });
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/');
      return;
    }

    setUsername(storedUsername || 'User');

    // Fetch tasks from backend
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    // Calculate stats whenever tasks change
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    setStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: Math.round(completionRate)
    });
  }, [tasks]);

  const handleAddTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prevTasks => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error; // Propagate error to AddTask component
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find(t => t._id === taskId);
      const response = await axios.patch(
        `${API_BASE_URL}/api/tasks/${taskId}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prevTasks => prevTasks.map(t => t._id === taskId ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prevTasks => prevTasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {username}!</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-2xl font-bold">{stats.totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Completion Rate</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AddTask onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Progress Overview</h2>
          <ProgressChart stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
