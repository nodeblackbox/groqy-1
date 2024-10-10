// frontend/src/components/mainDashboardComponents/views/apiMaker.jsx

"use client";

import React, { useState } from "@/components/mainDashboardComponents/Button";
import { Plus, Trash } from "lucide-react";

const ApiMaker = () => {
    const [endpoints, setEndpoints] = useState([
        { id: 1, path: "/users", method: "GET" },
        { id: 2, path: "/users", method: "POST" },
    ]);

    const [newPath, setNewPath] = useState("");
    const [newMethod, setNewMethod] = useState("GET");

    const addEndpoint = () => {
        if (newPath.trim() === "") return;
        const newId = endpoints.length ? endpoints[endpoints.length - 1].id + 1 : 1;
        const newEndpoint = { id: newId, path: newPath, method: newMethod };
        setEndpoints([...endpoints, newEndpoint]);
        setNewPath("");
        setNewMethod("GET");
    };

    const removeEndpoint = (id) => {
        setEndpoints(endpoints.filter((endpoint) => endpoint.id !== id));
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">API Maker</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New Endpoint</h3>
                <div className="flex space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="Endpoint Path (e.g., /products)"
                        value={newPath}
                        onChange={(e) => setNewPath(e.target.value)}
                        className="flex-grow p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                        value={newMethod}
                        onChange={(e) => setNewMethod(e.target.value)}
                        className="p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                    </select>
                    <Button variant="primary" onClick={addEndpoint}>
                        <Plus size={16} className="mr-2" />
                        Add
                    </Button>
                </div>

                <h3 className="text-xl font-semibold mb-4">Existing Endpoints</h3>
                <ul className="space-y-2">
                    {endpoints.map((endpoint) => (
                        <li key={endpoint.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                            <div>
                                <span className="font-semibold">{endpoint.method}</span> {endpoint.path}
                            </div>
                            <button
                                className="text-red-500 hover:text-red-700 flex items-center"
                                onClick={() => removeEndpoint(endpoint.id)}
                            >
                                <Trash size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ApiMaker;
