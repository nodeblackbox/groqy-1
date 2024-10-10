// frontend/src/components/mainDashboardComponents/views/TeamCollaborationView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const TeamCollaborationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Team Collaboration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Members */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Team Members</h3>
                <ul className="space-y-4">
                    {[
                        { name: "John Doe", role: "Frontend Developer", status: "Online" },
                        { name: "Jane Smith", role: "Backend Developer", status: "In a meeting" },
                        { name: "Bob Johnson", role: "UI/UX Designer", status: "Offline" },
                        { name: "Alice Williams", role: "Project Manager", status: "Online" },
                    ].map((member, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-gray-400">{member.role}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${member.status === "Online"
                                    ? "bg-green-500"
                                    : member.status === "In a meeting"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                            >
                                {member.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                <ul className="space-y-4">
                    {[
                        { action: "Commented on", item: "Bug #127", user: "John Doe", time: "5 minutes ago" },
                        { action: "Updated", item: "Project Timeline", user: "Alice Williams", time: "1 hour ago" },
                        { action: "Completed", item: "Code Review", user: "Jane Smith", time: "3 hours ago" },
                        { action: "Created", item: "New Design Mock-up", user: "Bob Johnson", time: "Yesterday" },
                    ].map((activity, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>
                                {activity.user} {activity.action} {activity.item}
                            </span>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default TeamCollaborationView;
