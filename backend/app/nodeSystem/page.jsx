'use client'
import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Plus, Mic } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const nodeTypes = {
    payload: ({ data }) => (
        <div className="bg-purple-500 p-2 rounded-lg">
            <h3 className="font-bold">{data.label}</h3>
            <p className="text-sm">Payload: {data.payload}</p>
        </div>
    ),
    routine: ({ data }) => (
        <div className="bg-green-500 p-2 rounded-lg">
            <h3 className="font-bold">{data.label}</h3>
            <p className="text-sm">Routine: {data.routine}</p>
        </div>
    ),
};
// npm install react-dropzone
const GroqyInterface = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [routines, setRoutines] = useState([]);
    const [payloads, setPayloads] = useState([]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result;
                // Determine if it's a routine or payload based on file content or extension
                if (file.name.endsWith('.routine'))
                {
                    setRoutines((prevRoutines) => [...prevRoutines, { name: file.name, content: fileContent }]);
                } else
                {
                    setPayloads((prevPayloads) => [...prevPayloads, { name: file.name, content: fileContent }]);
                }
            };
            reader.readAsText(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const addNode = (type, data) => {
        const newNode = {
            id: `${type}-${nodes.length + 1}`,
            type,
            position: { x: Math.random() * 500, y: Math.random() * 300 },
            data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`, ...data },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg w-full h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent">
                    Groqy
                </h1>
                <div className="relative w-1/3">
                    <input
                        type="text"
                        className="w-full bg-gray-800 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Search..."
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <div className="flex items-center space-x-2">
                    <Mic className="text-red-500" size={24} />
                    <div className="w-32 h-8 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-full flex items-center justify-around">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-red-500"
                                    style={{ height: `${Math.random() * 100}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 space-x-4">
                <div className="w-1/4 bg-gray-800 p-4 rounded-lg overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Routines & Payloads</h2>
                    <div {...getRootProps()} className={`border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 ${isDragActive ? 'border-purple-500' : ''}`}>
                        <input {...getInputProps()} />
                        <p className="text-center text-gray-400">Drag 'n' drop files here, or click to select files</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold">Routines</h3>
                        {routines.map((routine, index) => (
                            <div
                                key={index}
                                className="bg-green-600 p-2 rounded cursor-pointer hover:bg-green-500 transition"
                                onClick={() => addNode('routine', { routine: routine.name })}
                            >
                                {routine.name}
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2 mt-4">
                        <h3 className="font-bold">Payloads</h3>
                        {payloads.map((payload, index) => (
                            <div
                                key={index}
                                className="bg-purple-600 p-2 rounded cursor-pointer hover:bg-purple-500 transition"
                                onClick={() => addNode('payload', { payload: payload.name })}
                            >
                                {payload.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                        <MiniMap />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

export default GroqyInterface;