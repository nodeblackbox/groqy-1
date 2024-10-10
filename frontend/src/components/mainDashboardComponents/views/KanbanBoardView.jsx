// frontend/src/components/mainDashboardComponents/views/KanbanBoardView.jsx

"use client";


import React, { useState } from 'react';



const KanbanBoardView = () => {
    const [tasks, setTasks] = useState({
        todo: [
            { id: 1, title: "Design new landing page" },
            { id: 2, title: "Implement user authentication" },
        ],
        inProgress: [
            { id: 3, title: "Optimize database queries" },
            { id: 4, title: "Create API documentation" },
        ],
        done: [
            { id: 5, title: "Set up CI/CD pipeline" },
            { id: 6, title: "Write unit tests for core modules" },
        ],
    });

    const onDragStart = (e, id) => {
        e.dataTransfer.setData("text/plain", id);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, category) => {
        const id = e.dataTransfer.getData("text");
        const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
        const task = allTasks.find((task) => task.id === parseInt(id));

        if (!task) return;

        const newTasks = {
            todo: tasks.todo.filter((task) => task.id !== parseInt(id)),
            inProgress: tasks.inProgress.filter((task) => task.id !== parseInt(id)),
            done: tasks.done.filter((task) => task.id !== parseInt(id)),
        };

        newTasks[category] = [...newTasks[category], task];
        setTasks(newTasks);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Kanban Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(tasks).map((category) => (
                    <div
                        key={category}
                        className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, category)}
                    >
                        <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                        <ul className="space-y-2">
                            {tasks[category].map((task) => (
                                <li
                                    key={task.id}
                                    className="bg-gray-700 p-3 rounded-lg cursor-move"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, task.id)}
                                >
                                    {task.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoardView;
