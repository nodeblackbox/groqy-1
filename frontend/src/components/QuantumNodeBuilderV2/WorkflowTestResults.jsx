// src/components/QuantumNodeBuilderV2/WorkflowTestResults.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd'; // Import Rnd from react-rnd
import { X } from 'lucide-react'; // Import X icon for closing
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const WorkflowTestResults = ({ workflowTestResults, onClose }) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 400, height: 300 });

    // Load saved position and size from localStorage
    useEffect(() => {
        const savedPosition = localStorage.getItem('testResultsPosition');
        const savedSize = localStorage.getItem('testResultsSize');

        if (savedPosition) {
            setPosition(JSON.parse(savedPosition));
        }

        if (savedSize) {
            setSize(JSON.parse(savedSize));
        }
    }, []);

    // Save position and size to localStorage on drag or resize stop
    const handleDragStop = (e, d) => {
        const newPos = { x: d.x, y: d.y };
        setPosition(newPos);
        localStorage.setItem('testResultsPosition', JSON.stringify(newPos));
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        const newSize = { width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) };
        setSize(newSize);
        setPosition(position);
        localStorage.setItem('testResultsSize', JSON.stringify(newSize));
        localStorage.setItem('testResultsPosition', JSON.stringify(position));
    };

    return (
        <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            minWidth={300}
            minHeight={200}
            bounds="window" // Prevent dragging outside the window
            className="z-50"
            style={{ 
                border: '1px solid #38bdf8', // Cyan border
                backgroundColor: '#1a202c', // Gray-800 equivalent
                color: '#00bcd4', // Cyan-400 equivalent
                borderRadius: '0.5rem', // Rounded corners
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', // Shadow
            }}
        >
            <div className="handle flex justify-between items-center p-2 bg-gray-700 cursor-move rounded-t-lg">
                <h2 className="text-lg font-bold">Workflow Test Results</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="p-2 overflow-y-auto" style={{ height: 'calc(100% - 40px)' }}>
                {Object.entries(workflowTestResults).map(([nodeId, result]) => (
                    <div key={nodeId} className="mb-2">
                        <h3 className="text-md font-semibold text-cyan-400">Node: {nodeId}</h3>
                        <p className="text-sm text-gray-300">Status: {result.status}</p>
                        <pre className="bg-gray-900 p-2 rounded-lg mt-1 text-xs overflow-auto">
                            {result.status === 'success'
                                ? JSON.stringify(result.data, null, 2)
                                : result.message}
                        </pre>
                    </div>
                ))}
            </div>
        </Rnd>
    );
};

export default WorkflowTestResults;
