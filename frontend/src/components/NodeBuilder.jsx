// src/app/QuantumNodeBuilderV2/page.jsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import { useNodesState, useEdgesState, addEdge } from "reactflow";
import HeaderBar from "@/components/QuantumNodeBuilderV2/HeaderBar";
import ReactFlowArea from "@/components/QuantumNodeBuilderV2/ReactFlowArea";
import WorkflowTestResults from "@/components/QuantumNodeBuilderV2/WorkflowTestResults";
import ErrorLog from "@/components/QuantumNodeBuilderV2/ErrorLog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const QuantumNexusWorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [errorLog, setErrorLog] = useState([]);
  const [workflowTestResults, setWorkflowTestResults] = useState({});
  const [copiedNode, setCopiedNode] = useState(null);
  const loadWorkflowInputRef = useRef(null);
  const [isTestResultsOpen, setIsTestResultsOpen] = useState(false); // New state for pop-up visibility

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: { stroke: sourceNode.data.color, strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      toast({
        title: "Connection Established",
        description: "Nodes connected successfully.",
      });
    },
    [nodes, setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const createNewNode = useCallback(
    (position, data) => {
      const newNode = {
        id: `quantum-${nodes.length + 1}`,
        type: "quantumNode",
        position,
        data: {
          ...data,
          onUpdate: (updatedData) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNode.id
                  ? { ...node, data: { ...node.data, ...updatedData } }
                  : node
              )
            );
          },
          selectedInputs: data.selectedInputs || {},
          selectedOutputs: data.selectedOutputs || {},
        },
        draggable: true,
      };

      setNodes((nds) => nds.concat(newNode));
      toast({
        title: "Task Added",
        description: "New quantum task has been added to the workflow.",
      });
    },
    [nodes, setNodes]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      createNewNode(position);
    },
    [createNewNode]
  );

  const handleCopy = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    if (selectedNodes.length === 1) {
      setCopiedNode(JSON.parse(JSON.stringify(selectedNodes[0])));
      toast({
        title: "Node Copied",
        description: "The selected node has been copied.",
      });
    }
  }, [nodes]);

  const handlePaste = useCallback(
    (event) => {
      if (copiedNode) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };
        const newNode = {
          ...copiedNode,
          id: `quantum-${nodes.length + 1}`,
          position,
          data: {
            ...copiedNode.data,
            onUpdate: (updatedData) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === newNode.id
                    ? { ...node, data: { ...node.data, ...updatedData } }
                    : node
                )
              );
            },
          },
          draggable: true,
        };
        setNodes((nds) => nds.concat(newNode));
        toast({
          title: "Node Pasted",
          description: "A new node has been created from the copied data.",
        });
      }
    },
    [copiedNode, nodes, setNodes]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "c") {
        handleCopy();
      } else if (event.ctrlKey && event.key === "v") {
        handlePaste(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCopy, handlePaste]);

  const addNewTask = (taskData) => {
    const position = { x: 100, y: 100 };
    createNewNode(position, taskData);
  };

  const saveWorkflow = () => {
    const workflow = { nodes, edges };
    const json = JSON.stringify(workflow);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "quantum_nexus_workflow.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Workflow Saved",
      description: "Your Quantum Nexus workflow has been saved successfully.",
    });
  };

  const loadWorkflow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        try {
          const workflow = JSON.parse(content);
          setNodes(
            workflow.nodes.map((node) => ({
              ...node,
              position:
                node.position.x === null || node.position.y === null
                  ? { x: Math.random() * 500, y: Math.random() * 500 }
                  : node.position,
              data: {
                ...node.data,
                onUpdate: (updatedData) => {
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === node.id
                        ? { ...n, data: { ...n.data, ...updatedData } }
                        : n
                    )
                  );
                },
              },
              draggable: true,
            }))
          );
          setEdges(workflow.edges || []);
          toast({
            title: "Workflow Loaded",
            description:
              "Your Quantum Nexus workflow has been loaded successfully.",
          });
        } catch (error) {
          setErrorLog((prev) => [...prev, `Error loading workflow: ${error}`]);
          toast({
            title: "Error",
            description:
              "Failed to load workflow. Please check the file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // Updated runWorkflowTests function in page.jsx

  const runWorkflowTests = async () => {
    const results = {};

    // Iterate over all nodes in the workflow
    for (const node of nodes) {
      // Check if the node has apiCalls defined in its data
      if (node.data.apiCalls && node.data.apiCalls.length > 0) {
        try {
          // Iterate over all apiCalls within the node
          for (const apiCall of node.data.apiCalls) {
            const response = await fetch(apiCall.url, {
              method: apiCall.method,
              headers: JSON.parse(apiCall.headers),
              body: apiCall.method !== "GET" ? apiCall.payload : undefined,
            });
            const result = await response.json();

            // If multiple API calls exist, append each to the node's results
            if (!results[node.id]) {
              results[node.id] = {
                status: "success",
                data: [result],
              };
            } else {
              results[node.id].data.push(result);
            }
          }
        } catch (error) {
          // Capture errors for any failed API requests
          results[node.id] = {
            status: "error",
            message: error.message,
          };
        }
      } else {
        // Handle nodes without any API calls
        results[node.id] = {
          status: "no-api-calls",
          message: "No API calls defined for this node.",
        };
      }
    }

    // Set workflow results and open the results pop-up
    setWorkflowTestResults(results);
    setIsTestResultsOpen(true);

    toast({
      title: "Workflow Tests Completed",
      description: "All API tests in the workflow have been executed.",
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Function to close the WorkflowTestResults pop-up
  const closeTestResults = () => {
    setIsTestResultsOpen(false);
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
      <HeaderBar
        onAddTask={addNewTask}
        onSaveWorkflow={saveWorkflow}
        onLoadWorkflow={loadWorkflow}
        onRunTests={runWorkflowTests}
        loadWorkflowInputRef={loadWorkflowInputRef}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        apiKey={apiKey}
        setApiKey={setApiKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <ReactFlowProvider>
        <div
          className="flex-grow bg-gray-900"
          ref={reactFlowWrapper}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "c") {
              handleCopy();
            } else if (e.ctrlKey && e.key === "v") {
              handlePaste(e);
            }
          }}
          tabIndex={0}
        >
          <ReactFlowArea
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        </div>
      </ReactFlowProvider>
      {isTestResultsOpen && (
        <WorkflowTestResults
          workflowTestResults={workflowTestResults}
          onClose={closeTestResults} // Pass the close handler
        />
      )}
      {errorLog.length > 0 && <ErrorLog errorLog={errorLog} />}
    </div>
  );
};

export default QuantumNexusWorkflowBuilder;
