// frontend/src/components/mainDashboardComponents/views/BugTrackerView.jsx

"use client";

import React from "react";

const BugTrackerView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Bug Tracker</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-xl shadow-lg">
                <thead>
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Severity</th>
                        <th className="p-3 text-left">Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        {
                            id: "BUG-001",
                            description: "Login page not responsive on mobile",
                            status: "Open",
                            severity: "High",
                            assignedTo: "John Doe",
                        },
                        {
                            id: "BUG-002",
                            description: "Database connection timeout",
                            status: "In Progress",
                            severity: "Critical",
                            assignedTo: "Jane Smith",
                        },
                        {
                            id: "BUG-003",
                            description: "Incorrect calculation in billing module",
                            status: "Resolved",
                            severity: "Medium",
                            assignedTo: "Bob Johnson",
                        },
                    ].map((bug) => (
                        <tr key={bug.id} className="border-t border-gray-700">
                            <td className="p-3">{bug.id}</td>
                            <td className="p-3">{bug.description}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${bug.status === "Open"
                                        ? "bg-red-500"
                                        : bug.status === "In Progress"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                        }`}
                                >
                                    {bug.status}
                                </span>
                            </td>
                            <td className="p-3">{bug.severity}</td>
                            <td className="p-3">{bug.assignedTo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default BugTrackerView;
