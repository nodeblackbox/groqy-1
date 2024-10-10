// frontend/src/components/mainDashboardComponents/views/HomeView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";
import { FileText, Zap, Bug, Users } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const taskData = [
    { name: "Mon", tasks: 12, bugs: 5, workflows: 3 },
    { name: "Tue", tasks: 19, bugs: 3, workflows: 5 },
    { name: "Wed", tasks: 15, bugs: 7, workflows: 4 },
    { name: "Thu", tasks: 22, bugs: 2, workflows: 6 },
    { name: "Fri", tasks: 18, bugs: 4, workflows: 5 },
    { name: "Sat", tasks: 10, bugs: 1, workflows: 2 },
    { name: "Sun", tasks: 8, bugs: 0, workflows: 1 },
];

const HomeView = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Tasks Created", value: "5", icon: FileText },
                        { label: "AI Generations", value: "12", icon: Zap },
                        { label: "Open Bugs", value: "28", icon: Bug },
                        { label: "Team Members", value: "85%", icon: Users },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="flex items-center mb-2">
                                <item.icon className="mr-2" size={20} />
                                <h3 className="text-sm text-gray-400">{item.label}</h3>
                            </div>
                            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Workflow Performance Chart */}
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Workflow Performance</h3>
                    <h4 className="text-sm text-gray-400 mb-4">
                        Performance Metrics in Last 7 Days
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={taskData}>
                            <XAxis dataKey="name" stroke="#ffffff" />
                            <YAxis stroke="#ffffff" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="tasks"
                                name="Tasks"
                                stroke="#8884d8"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="bugs"
                                name="Bugs"
                                stroke="#82ca9d"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="workflows"
                                name="Workflows"
                                stroke="#ffc658"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-8">
                {/* Recent Activities */}
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                    <ul className="space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                        {[
                            "New AI workflow created for optimization",
                            "Bug #127 fixed and deployed to production",
                            "Team meeting scheduled for project kickoff",
                            "New team member onboarded to the platform",
                        ].map((activity, index) => (
                            <li key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>{activity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Create New Task", icon: FileText },
                            { label: "Generate Workflow", icon: Zap },
                            { label: "Report a Bug", icon: Bug },
                            { label: "Invite Team Member", icon: Users },
                        ].map((item) => (
                            <Button
                                key={item.label}
                                variant="primary"
                                className="flex items-center justify-start p-3"
                            >
                                <item.icon className="mr-3" size={20} />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HomeView;
