"use client";
// components/EditTaskModal.js
import React, { useState } from 'react';

const EditTaskModal = ({ task, onSave, onClose }) => {
    const [editedTask, setEditedTask] = useState(task);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedTask);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={editedTask.title}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Task Title"
                    />
                    <textarea
                        name="description"
                        value={editedTask.description}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Task Description"
                        rows="3"
                    />
                    <input
                        type="text"
                        name="assignedTo"
                        value={editedTask.assignedTo}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Assigned To"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={editedTask.dueDate}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                    />
                    <select
                        name="priority"
                        value={editedTask.priority}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                    >  <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                    <input
                        type="text"
                        name="segment"
                        value={editedTask.segment}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Segment"
                    />
                    <select
                        name="status"
                        value={editedTask.status}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                    >
                        <option value="Icebox">Icebox</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                    </select>
                    <input
                        type="number"
                        name="estimatedTime"
                        value={editedTask.estimatedTime}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Estimated Time (minutes)"
                    />
                    <input
                        type="number"
                        name="actualTime"
                        value={editedTask.actualTime}
                        onChange={handleChange}
                        className="w-full p-2 mb-2 bg-gray-700 rounded"
                        placeholder="Actual Time (minutes)"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;