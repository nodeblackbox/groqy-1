// frontend/src/components/mainDashboardComponents/views/taskManagerGanttChart.jsx

"use client";

import React, { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { format } from "date-fns";

const TaskManagerGanttChart = () => {
    const [tasks, setTasks] = useState([
        {
            start: new Date(2023, 5, 1),
            end: new Date(2023, 5, 5),
            name: "Task 1: Design",
            id: "Task 1",
            progress: 100,
            dependencies: [],
            type: "task",
        },
        {
            start: new Date(2023, 5, 6),
            end: new Date(2023, 5, 10),
            name: "Task 2: Development",
            id: "Task 2",
            progress: 50,
            dependencies: ["Task 1"],
            type: "task",
        },
        {
            start: new Date(2023, 5, 11),
            end: new Date(2023, 5, 15),
            name: "Task 3: Testing",
            id: "Task 3",
            progress: 0,
            dependencies: ["Task 2"],
            type: "task",
        },
        {
            start: new Date(2023, 5, 16),
            end: new Date(2023, 5, 20),
            name: "Task 4: Deployment",
            id: "Task 4",
            progress: 0,
            dependencies: ["Task 3"],
            type: "task",
        },
    ]);

    const handleTaskChange = (task) => {
        const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(updatedTasks);
    };

    const handleTaskDelete = (task) => {
        setTasks(tasks.filter((t) => t.id !== task.id));
    };

    const handleDblClick = (task) => {
        const newName = prompt("Edit Task Name:", task.name);
        if (newName)
        {
            const updatedTask = { ...task, name: newName };
            handleTaskChange(updatedTask);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Task Manager Gantt Chart</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <Gantt
                    tasks={tasks}
                    viewMode={ViewMode.Day}
                    locale="en-GB"
                    onDateChange={(task) => handleTaskChange(task)}
                    onDelete={handleTaskDelete}
                    onDoubleClick={handleDblClick}
                    listCellWidth="155px"
                    columnWidth={65}
                />
            </div>
        </div>
    );
};

export default TaskManagerGanttChart;
