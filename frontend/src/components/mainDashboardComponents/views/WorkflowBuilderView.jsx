// frontend/src/components/mainDashboardComponents/views/WorkflowBuilderView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const WorkflowBuilderView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Workflow Builder</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Workflow Name"
                    className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Select Workflow Type</option>
                    <option>Code Review</option>
                    <option>Continuous Integration</option>
                    <option>Deployment</option>
                    <option>Custom</option>
                </select>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 min-h-[200px]">
                    {/* Placeholder for drag-and-drop workflow builder */}
                    <p className="text-center text-gray-400">Drag and drop workflow components here</p>
                </div>
                <Button variant="primary" className="w-full">
                    Save Workflow
                </Button>
            </form>
        </div>
    </div>
);

export default WorkflowBuilderView;
