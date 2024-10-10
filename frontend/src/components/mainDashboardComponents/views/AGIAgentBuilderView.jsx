// frontend/src/components/mainDashboardComponents/views/AGIAgentBuilderView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const AGIAgentBuilderView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AGI Agent Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create New AGI Agent */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New AGI Agent</h3>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Agent Name"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                        placeholder="Agent Description"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                    ></textarea>
                    <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Select Base Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <Button variant="primary" className="w-full">
                        Create Agent
                    </Button>
                </form>
            </div>

            {/* Active AGI Agents */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Active AGI Agents</h3>
                <ul className="space-y-2">
                    {[
                        { name: "Code Reviewer", type: "Development", status: "Active" },
                        { name: "Data Analyzer", type: "Analytics", status: "Training" },
                        { name: "Customer Support", type: "Service", status: "Active" },
                        { name: "Content Generator", type: "Marketing", status: "Inactive" },
                    ].map((agent, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{agent.name}</p>
                                <p className="text-sm text-gray-400">{agent.type}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${agent.status === "Active"
                                    ? "bg-green-500"
                                    : agent.status === "Training"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                            >
                                {agent.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default AGIAgentBuilderView;
