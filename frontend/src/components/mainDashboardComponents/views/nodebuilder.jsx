// frontend/src/components/mainDashboardComponents/views/nodebuilder.jsx

"use client";

import React, { useState } from "@/components/mainDashboardComponents/Button";
import { Plus, Trash, Edit } from "lucide-react";

const NodeBuilder = () => {
    const [nodes, setNodes] = useState([
        { id: 1, name: "Start Node", type: "start", connections: [] },
        { id: 2, name: "Process Node", type: "process", connections: [1] },
        { id: 3, name: "End Node", type: "end", connections: [2] },
    ]);

    const addNode = () => {
        const newId = nodes.length ? nodes[nodes.length - 1].id + 1 : 1;
        const newNode = {
            id: newId,
            name: `Node ${newId}`,
            type: "process",
            connections: [],
        };
        setNodes([...nodes, newNode]);
    };

    const removeNode = (id) => {
        setNodes(nodes.filter((node) => node.id !== id));
    };

    const editNode = (id) => {
        const taskToEdit = nodes.find((node) => node.id === id);
        if (!taskToEdit) return;

        const newName = prompt("Enter new node name:", taskToEdit.name);
        if (newName)
        {
            setNodes(
                nodes.map((node) =>
                    node.id === id ? { ...node, name: newName } : node
                )
            );
        }
    };

    const connectNodes = (fromId, toId) => {
        setNodes(
            nodes.map((node) =>
                node.id === fromId
                    ? {
                        ...node,
                        connections: node.connections.includes(toId)
                            ? node.connections.filter((conn) => conn !== toId)
                            : [...node.connections, toId],
                    }
                    : node
            )
        );
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Node Builder</h2>
            <div className="flex justify-end">
                <Button variant="secondary" onClick={addNode} className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Node
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className="bg-gray-800 bg-opacity-50 p-4 rounded-xl shadow-lg flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold">{node.name}</h3>
                            <div className="flex space-x-2">
                                <button
                                    className="text-yellow-500 hover:text-yellow-700"
                                    onClick={() => editNode(node.id)}
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeNode(node.id)}
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Type: {node.type}</p>
                        <div>
                            <span className="text-sm font-medium">Connections:</span>
                            <ul className="list-disc list-inside">
                                {node.connections.length > 0 ? (
                                    node.connections.map((connId) => {
                                        const connectedNode = nodes.find((n) => n.id === connId);
                                        return connectedNode ? (
                                            <li key={connId}>{connectedNode.name}</li>
                                        ) : null;
                                    })
                                ) : (
                                    <li>No connections</li>
                                )}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm font-medium">Connect to:</span>
                            <div className="flex flex-wrap mt-2 space-x-2">
                                {nodes
                                    .filter((n) => n.id !== node.id)
                                    .map((n) => (
                                        <button
                                            key={n.id}
                                            onClick={() => connectNodes(node.id, n.id)}
                                            className={`px-2 py-1 rounded-full text-xs ${node.connections.includes(n.id)
                                                ? "bg-red-500 text-white"
                                                : "bg-green-500 text-white"
                                                }`}
                                        >
                                            {n.name}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NodeBuilder;
