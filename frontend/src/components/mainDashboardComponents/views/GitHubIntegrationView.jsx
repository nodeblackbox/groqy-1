// frontend/src/components/mainDashboardComponents/views/GitHubIntegrationView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const GitHubIntegrationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">GitHub Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connected Repositories */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Connected Repositories</h3>
                <ul className="space-y-2">
                    {[
                        { name: "frontend-app", status: "Connected", lastSync: "5 minutes ago" },
                        { name: "backend-api", status: "Connected", lastSync: "1 hour ago" },
                        { name: "mobile-app", status: "Disconnected", lastSync: "N/A" },
                        { name: "data-processing", status: "Connected", lastSync: "3 days ago" },
                    ].map((repo, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{repo.name}</p>
                                <p className="text-sm text-gray-400">Last synced: {repo.lastSync}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${repo.status === "Connected" ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                {repo.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent GitHub Activities */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Recent GitHub Activities</h3>
                <ul className="space-y-4">
                    {[
                        {
                            action: "Opened Pull Request",
                            repo: "frontend-app",
                            user: "John Doe",
                            time: "10 minutes ago",
                        },
                        {
                            action: "Merged Branch",
                            repo: "backend-api",
                            user: "Jane Smith",
                            time: "1 hour ago",
                        },
                        {
                            action: "Pushed Commit",
                            repo: "data-processing",
                            user: "Bob Johnson",
                            time: "3 hours ago",
                        },
                        {
                            action: "Created Issue",
                            repo: "frontend-app",
                            user: "Alice Williams",
                            time: "Yesterday",
                        },
                    ].map((activity, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>
                                {activity.user} {activity.action} in {activity.repo}
                            </span>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default GitHubIntegrationView;
