// frontend/src/components/mainDashboardComponents/views/taskManagerAdmin.jsx

"use client";


import React from "react";
import Button from "../Button";
import { Plus, Trash, Edit } from "lucide-react";

const TaskManagerAdmin = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Implement authentication", assignedTo: "John Doe", status: "In Progress" },
        { id: 2, title: "Design landing page", assignedTo: "Jane Smith", status: "Completed" },
        { id: 3, title: "Set up CI/CD pipeline", assignedTo: "Bob Johnson", status: "Pending" },
    ]);

    const addTask = () => {
        const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
        const newTask = {
            id: newId,
            title: "New Task",
            assignedTo: "Unassigned",
            status: "Pending",
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((task) => task.id === id);
        if (!taskToEdit) return;

        const newTitle = prompt("Enter new task title:", taskToEdit.title);
        const newAssignedTo = prompt("Assign to:", taskToEdit.assignedTo);
        const newStatus = prompt("Enter status (Pending/In Progress/Completed):", taskToEdit.status);

        if (newTitle && newAssignedTo && newStatus)
        {
            setTasks(
                tasks.map((task) =>
                    task.id === id
                        ? { ...task, title: newTitle, assignedTo: newAssignedTo, status: newStatus }
                        : task
                )
            );
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Task Manager Admin</h2>
            <div className="flex justify-end">
                <Button variant="secondary" onClick={addTask} className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Task
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-xl shadow-lg">
                    <thead>
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Assigned To</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-t border-gray-700">
                                <td className="p-3">{task.id}</td>
                                <td className="p-3">{task.title}</td>
                                <td className="p-3">{task.assignedTo}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${task.status === "Completed"
                                            ? "bg-green-500"
                                            : task.status === "In Progress"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </td>
                                <td className="p-3 flex space-x-2">
                                    <button
                                        className="text-yellow-500 hover:text-yellow-700"
                                        onClick={() => editTask(task.id)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeTask(task.id)}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskManagerAdmin;
