// frontend/src/components/mainDashboardComponents/views/AIWorkflowsView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const AIWorkflowsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AI Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Workflows */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Active Workflows</h3>
                <ul className="space-y-2">
                    {[
                        "Code Review Assistant",
                        "Bug Prediction Model",
                        "Automated Testing Pipeline",
                        "Performance Optimization Analyzer",
                    ].map((workflow, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <span>{workflow}</span>
                            <span className="px-2 py-1 bg-green-500 rounded-full text-xs">Active</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Create New Workflow */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Workflow name"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Select AI Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <Button variant="primary" className="w-full">
                        Create Workflow
                    </Button>
                </form>
            </div>
        </div>
    </div>
);

export default AIWorkflowsView;
