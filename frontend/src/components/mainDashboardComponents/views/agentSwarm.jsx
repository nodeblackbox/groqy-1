// frontend/src/components/mainDashboardComponents/views/agentSwarm.jsx

"use client";

import React, { useState } from "../components/mainDashboardComponents/Button";
import { Plus, Trash } from "lucide-react";

const AgentSwarm = () => {
    const [agents, setAgents] = useState([
        { id: 1, name: "Agent Alpha", role: "Data Processor", status: "Active" },
        { id: 2, name: "Agent Beta", role: "Task Executor", status: "Inactive" },
        { id: 3, name: "Agent Gamma", role: "Analytics Specialist", status: "Active" },
        { id: 4, name: "Agent Delta", role: "Monitoring Agent", status: "Active" },
    ]);

    const addAgent = () => {
        const newId = agents.length ? agents[agents.length - 1].id + 1 : 1;
        const newAgent = {
            id: newId,
            name: `Agent ${String.fromCharCode(65 + newId)}`,
            role: "New Role",
            status: "Inactive",
        };
        setAgents([...agents, newAgent]);
    };

    const removeAgent = (id) => {
        setAgents(agents.filter((agent) => agent.id !== id));
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Agent Swarm</h2>
            <div className="flex justify-end">
                <Button variant="secondary" onClick={addAgent} className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Agent
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {agents.map((agent) => (
                    <div
                        key={agent.id}
                        className="bg-gray-800 bg-opacity-50 p-4 rounded-xl shadow-lg flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white mb-4">
                            {agent.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-semibold">{agent.name}</h3>
                        <p className="text-sm text-gray-400">{agent.role}</p>
                        <span
                            className={`mt-2 px-2 py-1 rounded-full text-xs ${agent.status === "Active"
                                ? "bg-green-500"
                                : agent.status === "Inactive"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                        >
                            {agent.status}
                        </span>
                        <button
                            className="mt-4 text-red-500 hover:text-red-700"
                            onClick={() => removeAgent(agent.id)}
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentSwarm;
