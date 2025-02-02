import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task._id)}
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                />
                <div>
                  <p className={`font-medium ${
                    task.completed 
                      ? 'line-through text-gray-400' 
                      : 'text-gray-800'
                  }`}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-sm text-gray-500">
                      Due: {formatDate(task.dueDate)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDeleteTask(task._id)}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
                aria-label="Delete task"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
