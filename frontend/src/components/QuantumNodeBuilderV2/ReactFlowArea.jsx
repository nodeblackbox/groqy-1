// components/ReactFlowArea.jsx
"use client";

import React, { useRef, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import QuantumNode from './QuantumNode';
import { useToast } from "@/hooks/use-toast";

const nodeTypes = {
    quantumNode: QuantumNode,
};

const ReactFlowArea = ({
    nodes,
    setNodes,
    edges,
    setEdges,
    onConnect,
    onNodesChange,
    onEdgesChange,
    onDrop,
    onDragOver,
}) => {
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid={false}
        >
            <Background color="#4a5568" gap={16} />
            <Controls />
            <MiniMap style={{ height: 120 }} zoomable pannable />
        </ReactFlow>
    );
};

export default ReactFlowArea;