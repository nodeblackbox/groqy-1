"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ChevronRight,
  ChevronDown,
  Play,
  Edit,
  Save,
  Download,
  Upload,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  Copy,
  Bell,
  Menu,
  User,
  Settings,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// TreeNode Component for JSON Structure Builder
const TreeNode = ({ node, onAdd, onDelete, onToggle, onEdit, searchTerm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(node.name);

  const handleEdit = (e) => {
    if (e.key === "Enter") {
      onEdit(node.id, "name", fieldValue);
      setIsEditing(false);
    }
  };

  const matchesSearch = (name) => {
    if (!searchTerm) return true;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  if (!matchesSearch(node.name)) {
    return null;
  }

  return (
    <div className="ml-4">
      <div className="flex items-center space-x-2 my-1">
        {node.children && node.children.length > 0 && (
          <button
            onClick={() => onToggle(node.id)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {node.isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {isEditing ? (
          <Input
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            onKeyDown={handleEdit}
            onBlur={() => {
              onEdit(node.id, "name", fieldValue);
              setIsEditing(false);
            }}
            className="h-6 py-0 px-1 w-24 bg-gray-700 border border-gray-600 text-white text-xs"
          />
        ) : (
          <span
            className="text-green-400 text-xs cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {node.name}
          </span>
        )}
        {node.value !== undefined && (
          <span className="text-yellow-400 text-xs">: {node.value}</span>
        )}
        <div className="ml-auto flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAdd(node.id)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          {node.id !== "root" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(node.id)}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      {node.isOpen && node.children && (
        <div className="ml-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
              onToggle={onToggle}
              onEdit={onEdit}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// JSON Viewer Component for Beautified Output
const JSONViewer = ({ json }) => {
  return (
    <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
      {JSON.stringify(json, null, 2)}
    </pre>
  );
};

export default function PayloadMakerUI() {
  // State Variables
  const [url, setUrl] = useState("");
  const [payloads, setPayloads] = useState([]);
  const [activePayload, setActivePayload] = useState(null);
  const [results, setResults] = useState({});
  const [useAuth, setUseAuth] = useState(false);
  const [bearerToken, setBearerToken] = useState("");
  const [jsonStructure, setJsonStructure] = useState({
    id: "root",
    name: "root",
    children: [],
    isOpen: true,
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedConfig, setImportedConfig] = useState("");
  const [globalVariables, setGlobalVariables] = useState({});
  const [newVarName, setNewVarName] = useState("");
  const [newVarValue, setNewVarValue] = useState("");
  const [routines, setRoutines] = useState([]);
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [isAsyncExecution, setIsAsyncExecution] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [payloadType, setPayloadType] = useState("other");

  //Store the Payloads inside the Vector DB:
  //Run the routines then click on push TO Qdrant:
  const [pushToDB, setPushToDB] = useState([]);

  // Refs for Drag-and-Drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Load from Local Storage on Mount
  useEffect(() => {
    try {
      const storedPayloads = JSON.parse(
        localStorage.getItem("payloads") || "[]"
      );
      const storedGlobalVariables = JSON.parse(
        localStorage.getItem("globalVariables") || "{}"
      );
      const storedRoutines = JSON.parse(
        localStorage.getItem("routines") || "[]"
      );
      const storedJsonStructure = JSON.parse(
        localStorage.getItem("jsonStructure") ||
          '{"id":"root","name":"root","children":[],"isOpen":true}'
      );
      setPayloads(storedPayloads);
      setGlobalVariables(storedGlobalVariables);
      setRoutines(storedRoutines);
      setJsonStructure(storedJsonStructure);
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      toast.error("Failed to load saved data.");
    }
  }, []);

  // Save to Local Storage on Changes
  useEffect(() => {
    try {
      localStorage.setItem("payloads", JSON.stringify(payloads));
      localStorage.setItem("globalVariables", JSON.stringify(globalVariables));
      localStorage.setItem("routines", JSON.stringify(routines));
      localStorage.setItem("jsonStructure", JSON.stringify(jsonStructure));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast.error("Failed to save data.");
    }
  }, [payloads, globalVariables, routines, jsonStructure]);

  // Payload Management Functions
  const createPayload = (type) => {
    const newPayload = {
      id: uuidv4(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Payload ${
        payloads.length + 1
      }`,
      description: "",
      url: "",
      method: "GET",
      headers: "{}",
      body: "{}",
      subtasks: [],
      createdAt: new Date().toISOString(),
      type: type,
    };
    setPayloads([...payloads, newPayload]);
    handleSetActivePayload(newPayload);
    toast.success(`New ${type} payload created.`);
  };

  const handleSetActivePayload = (payload) => {
    setActivePayload(payload);
    setPayloadType(payload.type);
  };

  const updatePayload = (id, updates) => {
    const updatedPayloads = payloads.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    setPayloads(updatedPayloads);
    if (activePayload && activePayload.id === id) {
      const updatedActivePayload = { ...activePayload, ...updates };
      handleSetActivePayload(updatedActivePayload);
    }
  };

  const deletePayload = (id) => {
    if (confirm("Are you sure you want to delete this payload?")) {
      setPayloads(payloads.filter((p) => p.id !== id));
      if (activePayload && activePayload.id === id) {
        setActivePayload(null);
      }
      toast.success("Payload deleted.");
    }
  };

  const addSubtask = (payloadId) => {
    const payload = payloads.find((p) => p.id === payloadId);
    if (payload) {
      const newSubtask = {
        id: uuidv4(),
        name: `Subtask ${payload.subtasks.length + 1}`,
        description: "",
        url: "",
        method: "GET",
        headers: "{}",
        body: "{}",
      };
      updatePayload(payloadId, { subtasks: [...payload.subtasks, newSubtask] });
      toast.success("Subtask added.");
    }
  };

  const updateSubtask = (payloadId, subtaskId, updates) => {
    const payload = payloads.find((p) => p.id === payloadId);
    if (payload) {
      const updatedSubtasks = payload.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, ...updates } : st
      );
      updatePayload(payloadId, { subtasks: updatedSubtasks });
    }
  };

  const deleteSubtask = (payloadId, subtaskId) => {
    if (confirm("Are you sure you want to delete this subtask?")) {
      const payload = payloads.find((p) => p.id === payloadId);
      if (payload) {
        const updatedSubtasks = payload.subtasks.filter(
          (st) => st.id !== subtaskId
        );
        updatePayload(payloadId, { subtasks: updatedSubtasks });
        toast.success("Subtask deleted.");
      }
    }
  };

  // JSON Structure Management
  const addNodeToJsonStructure = (parentId) => {
    const newNode = {
      id: uuidv4(),
      name: "New Node",
      value: "",
      children: [],
      isOpen: true,
    };
    const addNodeRecursive = (node) => {
      if (node.id === parentId) {
        node.children = [...(node.children || []), newNode];
        return true;
      }
      if (node.children) {
        for (let child of node.children) {
          if (addNodeRecursive(child)) return true;
        }
      }
      return false;
    };
    const newStructure = { ...jsonStructure };
    addNodeRecursive(newStructure);
    setJsonStructure(newStructure);
    toast.success("Node added to JSON structure.");
  };

  const deleteNodeFromJsonStructure = (nodeId) => {
    const deleteNodeRecursive = (node) => {
      if (node.children) {
        node.children = node.children.filter((child) => child.id !== nodeId);
        node.children.forEach(deleteNodeRecursive);
      }
    };
    const newStructure = { ...jsonStructure };
    if (newStructure.id === nodeId) {
      toast.error("Cannot delete root node.");
      return;
    }
    deleteNodeRecursive(newStructure);
    setJsonStructure(newStructure);
    toast.success("Node deleted from JSON structure.");
  };

  const toggleNodeInJsonStructure = (nodeId) => {
    const toggleNodeRecursive = (node) => {
      if (node.id === nodeId) {
        node.isOpen = !node.isOpen;
        return true;
      }
      if (node.children) {
        for (let child of node.children) {
          if (toggleNodeRecursive(child)) return true;
        }
      }
      return false;
    };
    const newStructure = { ...jsonStructure };
    toggleNodeRecursive(newStructure);
    setJsonStructure(newStructure);
  };

  const editNodeInJsonStructure = (nodeId, field, value) => {
    const editNodeRecursive = (node) => {
      if (node.id === nodeId) {
        node[field] = value;
        return true;
      }
      if (node.children) {
        for (let child of node.children) {
          if (editNodeRecursive(child)) return true;
        }
      }
      return false;
    };
    const newStructure = { ...jsonStructure };
    editNodeRecursive(newStructure);
    setJsonStructure(newStructure);
  };

  // Routine Management
  const createRoutine = () => {
    const newRoutine = {
      id: uuidv4(),
      name: `Routine ${routines.length + 1}`,
      payloads: [],
      createdAt: new Date().toISOString(),
    };
    setRoutines([...routines, newRoutine]);
    setActiveRoutine(newRoutine);
    toast.success("New routine created.");
  };

  const updateRoutine = (id, updates) => {
    setRoutines(routines.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    if (activeRoutine && activeRoutine.id === id) {
      setActiveRoutine({ ...activeRoutine, ...updates });
    }
  };

  const deleteRoutine = (id) => {
    if (confirm("Are you sure you want to delete this routine?")) {
      setRoutines(routines.filter((r) => r.id !== id));
      if (activeRoutine && activeRoutine.id === id) {
        setActiveRoutine(null);
      }
      toast.success("Routine deleted.");
    }
  };

  const addPayloadToRoutine = (routineId, payloadId) => {
    const routine = routines.find((r) => r.id === routineId);
    if (routine && !routine.payloads.includes(payloadId)) {
      updateRoutine(routineId, { payloads: [...routine.payloads, payloadId] });
      toast.success("Payload added to routine.");
    }
  };

  const removePayloadFromRoutine = (routineId, payloadId) => {
    const routine = routines.find((r) => r.id === routineId);
    if (routine) {
      const updatedPayloads = routine.payloads.filter((id) => id !== payloadId);
      updateRoutine(routineId, { payloads: updatedPayloads });
      toast.success("Payload removed from routine.");
    }
  };

  const addResultToSubtask = () => {
    const recentResults = JSON.parse(localStorage.getItem("recentResults"));
    if (!recentResults) return toast.error("No recent results found.");

    const activePayloadId = activePayload?.id;
    if (!activePayloadId) return toast.error("No active payload found.");

    const matchingResult = recentResults[activePayloadId];
    if (!matchingResult) return toast.error("No matching result found.");

    const updatedSubtasks = [...activePayload.subtasks];
    updatedSubtasks[updatedSubtasks.length - 1] = {
      ...updatedSubtasks[updatedSubtasks.length - 1],
      body: JSON.stringify(matchingResult),
    };

    updateSubtask(
      activePayload.id,
      updatedSubtasks[updatedSubtasks.length - 1].id,
      updatedSubtasks[updatedSubtasks.length - 1]
    );

    toast.success("Recent result added to subtask.");
  };

  const executeRoutine = async (routine) => {
    toast.loading("Executing routine...", { id: "routineExecution" });
    for (const payloadId of routine.payloads) {
      const payload = payloads.find((p) => p.id === payloadId);
      if (payload) {
        await executePayloadWithSubtasks(payload);
      }
    }
    toast.success("Routine executed successfully!", { id: "routineExecution" });
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // Payload Execution:
  const handleSendPayload = async (payload) => {
    try {
      console.log("Payload details:", payload);
      let headers = {};

      // Parse headers safely and replace single quotes with double quotes
      try {
        const sanitizedHeaders = payload.headers.replace(/'/g, '"');
        headers = JSON.parse(sanitizedHeaders);
      } catch (error) {
        console.error("Error parsing headers:", error);
        toast.error("Invalid headers format. Please check your JSON.");
        return;
      }

      // Add default Content-Type header if none exists
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      // Add Authorization if needed
      if (useAuth) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
      }

      // Replace variables in URL and headers
      let interpolatedUrl = interpolateString(payload.url, globalVariables);
      const interpolatedHeaders = interpolateObject(headers, globalVariables);
      let interpolatedBody;

      //title - needed to push data to the DB
      let title = "";

      // Handle payload type-specific logic
      switch (payload.type) {
        case "add": // Creating memory
          title = "Payload for Adding data to the Gravrag  (Creating Memory)";
          console.log("Handling 'add' payload (Creating Memory)...");
          interpolatedBody = {
            content: interpolatedBody?.content || "This is a sample memory",
            metadata: {
              objective_id: interpolatedBody?.metadata?.objective_id || "obj_1",
              task_id: interpolatedBody?.metadata?.task_id || "task_1",
            },
          };
          break;

        case "recall": // Recalling memory
          title =
            "Payload for Pulling data from the Gravrag  (Recalling Memory)";
          console.log("Handling 'recall' payload (Recalling Memory)...");
          const query = interpolatedBody?.query || "your_query_here";
          const topK = 5; // Default value for top_k
          interpolatedBody = {
            query: query,
            top_k: topK,
          };
          break;

        case "prune": // Pruning memory
          title = "Payload for Pruning the Gravrag";
          console.log("Handling 'prune' payload (Pruning Memory)...");
          interpolatedBody = {}; // Empty body for prune request
          break;

        case "neural_route": // Sending a query to a model
          title =
            "Payload for Sending a Query to a Model and getting a response (Neural route Payload)";
          console.log("Handling 'neural_route' payload...");
          const rawBody = payload.body;

          // Directly parse the incoming body assuming it's in the correct JSON format
          try {
            interpolatedBody = JSON.parse(rawBody);
          } catch (error) {
            console.error("Error parsing neural_route body:", error);
            return; // Exit if parsing fails
          }

          // Prepare the final body to send to the API
          interpolatedBody = {
            content: interpolatedBody.content,
            role: interpolatedBody.role,
            model: interpolatedBody.model || undefined, // Optional model
          };

          // Log the final body for debugging
          console.log("Final body for neural_route:", interpolatedBody);
          break;

        case "neural_set_key": // Setting the API key
          title =
            "Payload for Adding API Keys to a Model (Neural Set Key Payload)";
          let body = JSON.parse(payload.apiKey);
          console.log("handling 'neural_set_key' payload...");

          interpolatedBody = {
            provider: body?.provider || "default_provider",
            api_key:
              interpolateString(body?.api_key, globalVariables) ||
              "your_api_key_here",
          };
          break;

        case "neural_available": // Retrieving available models
          title =
            "Payload for Checking what models are available (Neural Available Models Payload)";
          console.log("Handling 'neural_available' payload...");
          // No body needed for GET request, so keep interpolatedBody as undefined
          break;

        case "neural_model_info": // Getting information about a specific model
          title =
            "Payload for Getting information about the model (Neural Model Info Payload)";
          console.log("Handling 'neural_model_info' payload...");

          // Check if payload.model exists, append to URL if available
          if (payload.model) {
            interpolatedUrl = `${interpolatedUrl}/${payload.model}`;
          }
          break;

        case "other":
        default:
          console.log("Handling 'other' or unknown payload...");
          break;
      }

      let JsonObjectToSend = {
        url: interpolatedUrl,
        method: payload.method,
        headers: interpolatedHeaders,
        body:
          payload.method !== "GET"
            ? JSON.stringify(interpolatedBody)
            : undefined,
      };

      // Final console.log for the request details before sending
      console.log(
        "Sending request with the following details:",
        JsonObjectToSend
      );

      // Send the request
      const response = await fetch(interpolatedUrl, {
        method: JsonObjectToSend.method,
        headers: JsonObjectToSend.headers,
        body: JsonObjectToSend.body,
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Check the response status
      if (response.ok) {
        // Update the pushToDB state
        const payloadTitle = title;

        // Update the pushToDB state
        setPushToDB((prevState) => {
          // Find if a payload with the same title already exists
          const existingIndex = prevState.findIndex(
            (item) => item.title === payloadTitle
          );

          // Structure: { title: payload.type, content: JsonObjectToSend }
          const newPayload = {
            title: payloadTitle,
            content: JsonObjectToSend,
          };

          // If the payload with the same title exists, replace it, otherwise append it
          if (existingIndex !== -1) {
            // Payload with the same title exists, overwrite it
            const updatedArray = [...prevState];
            updatedArray[existingIndex] = newPayload;
            return updatedArray;
          } else {
            // Payload doesn't exist, append it
            return [...prevState, newPayload];
          }
        });

        // If the response status is 200-299
        toast.success(`Payload "${payload.name}" sent successfully!`);
        // Update the results in state
        setResults((prev) => ({
          ...prev,
          [payload.id]: { url: interpolatedUrl, payload, response: data },
        }));
        return data;
      } else {
        // If the response status is not OK (not in the 200-299 range)
        console.error("Error response:", data);
        toast.error(
          `Failed to send payload "${payload.name}": ${response.status} - ${
            data.message || data
          }`
        );
        // Update results in state with the error
        setResults((prev) => ({
          ...prev,
          [payload.id]: {
            url: interpolatedUrl,
            payload,
            response: { error: data },
          },
        }));
        return { error: data };
      }
    } catch (error) {
      console.error("Error sending payload:", error);

      // Update results in state with the error
      setResults((prev) => ({
        ...prev,
        [payload.id]: {
          url: payload.url,
          payload,
          response: { error: error.message },
        },
      }));

      toast.error(`Failed to send payload "${payload.name}": ${error.message}`);
      return { error: error.message };
    }
  };

  const executePayloadWithSubtasks = async (payload) => {
    const mainResult = await handleSendPayload(payload);
    if (payload.subtasks && payload.subtasks.length > 0) {
      if (isAsyncExecution) {
        await Promise.all(
          payload.subtasks.map(async (subtask) => {
            await handleSendPayload({
              ...subtask,
              headers: payload.headers, // Use main payload headers for subtasks
              url: interpolateString(subtask.url, {
                ...globalVariables,
                ...mainResult,
              }),
            });
          })
        );
      } else {
        for (const subtask of payload.subtasks) {
          await handleSendPayload({
            ...subtask,
            headers: payload.headers, // Use main payload headers for subtasks
            url: interpolateString(subtask.url, {
              ...globalVariables,
              ...mainResult,
            }),
          });
        }
      }
    }
  };

  // Variable Interpolation Functions
  const interpolateString = (str, variables) => {
    return str.replace(/\${([^}]+)}/g, (_, key) => {
      return variables[key] || `\${${key}}`;
    });
  };

  const interpolateObject = (obj, variables) => {
    const result = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "string") {
        result[key] = interpolateString(value, variables);
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  // Import & Export Configuration
  const handleImportConfig = () => {
    try {
      const config = JSON.parse(importedConfig);
      setPayloads(config.payloads || []);
      setJsonStructure(
        config.jsonStructure || {
          id: "root",
          name: "root",
          children: [],
          isOpen: true,
        }
      );
      setGlobalVariables(config.globalVariables || {});
      setRoutines(config.routines || []);
      setIsImportModalOpen(false);
      toast.success("Configuration imported successfully!");
    } catch (error) {
      console.error("Import Config Error:", error);
      toast.error("Invalid configuration format.");
    }
  };

  const handleExportConfig = () => {
    const config = {
      payloads,
      jsonStructure,
      globalVariables,
      routines,
    };
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const urlBlob = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.download = "payload_tester_config.json";
    link.click();
    toast.success("Configuration exported successfully!");
  };

  // Drag-and-Drop Handlers
  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    const copyListItems = [...payloads];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setPayloads(copyListItems);
    toast.success("Payloads reordered.");
  };

  // Sorting and Filtering
  const sortedPayloads = [...payloads].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "date") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const filteredPayloads = sortedPayloads.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*
  
  
  
  
  
  
  
  
  
  */
  //This function will push all of the payloads into the DB
  const pushPayloadsToDB = async () => {
    // Loop through each object in the pushToDB array
    for (const item of pushToDB) {
      const { title, content } = item;

      try {
        // Prepare the metadata object (the content JSON object)
        const metadataObj = content;

        let baseURL = interpolateString("${baseUrl}", globalVariables);

        // Send POST request to the Vector DB with content and metadata
        const response = await fetch(`${baseURL}/gravrag/create_memory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: title, // Sending title as the content
            metadata: metadataObj, // Sending JSON object as metadata
          }),
        });

        // Check if the insertion was successful
        if (!response.ok) {
          toast.error(
            `Failed to insert "${title}" into the vector DB. Network response was not ok.`
          );
        } else {
          toast.success(`Successfully inserted "${title}" into the vector DB.`);
        }
      } catch (error) {
        toast.error(
          `Error inserting "${title}" into the vector DB: ${error.message}`
        );
      }
    }
  };
  // Execute All Payloads
  const executeAllPayloads = async () => {
    if (payloads.length === 0) {
      toast.error("No payloads to execute.");
      return;
    }
    toast.loading("Executing all payloads...", { id: "executeAll" });
    for (const payload of payloads) {
      await executePayloadWithSubtasks(payload);
    }
    toast.success("All payloads executed successfully!", { id: "executeAll" });
  };

  // Execute All Routines
  const executeAllRoutines = async () => {
    if (routines.length === 0) {
      toast.error("No routines to execute.");
      return;
    }
    toast.loading("Executing all routines...", { id: "executeAllRoutines" });
    for (const routine of routines) {
      await executeRoutine(routine);
    }
    toast.success("All routines executed successfully!", {
      id: "executeAllRoutines",
    });
  };

  // Render payload edit window based on type
  const renderPayloadEditWindow = () => {
    if (!activePayload) return null;

    // Common fields for all payloads
    const commonFields = (
      <>
        <Input
          value={activePayload.name}
          onChange={(e) =>
            updatePayload(activePayload.id, { name: e.target.value })
          }
          placeholder="Payload Name"
        />
        <Input
          value={activePayload.description}
          onChange={(e) =>
            updatePayload(activePayload.id, { description: e.target.value })
          }
          placeholder="Payload Description"
        />
        <Input
          value={activePayload.url}
          onChange={(e) =>
            updatePayload(activePayload.id, { url: e.target.value })
          }
          placeholder="API URL"
        />
        <select
          value={activePayload.method}
          onChange={(e) =>
            updatePayload(activePayload.id, { method: e.target.value })
          }
          className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </>
    );

    // Payload-specific form fields
    switch (activePayload.type) {
      case "add":
        return (
          <>
            {commonFields}
            <Textarea
              value={activePayload.body}
              onChange={(e) =>
                updatePayload(activePayload.id, { body: e.target.value })
              }
              placeholder="Data to add to Gravrag (JSON)"
              rows={8}
            />
          </>
        );

      case "recall":
        return (
          <>
            {commonFields}
            <Input
              value={activePayload.query}
              onChange={(e) =>
                updatePayload(activePayload.id, { query: e.target.value })
              }
              placeholder="Query for recalling memory"
            />
          </>
        );

      case "prune":
        return <>{commonFields}</>;

      case "neural_route":
        return (
          <>
            {commonFields}
            <Textarea
              value={activePayload.body}
              onChange={(e) =>
                updatePayload(activePayload.id, { body: e.target.value })
              }
              placeholder="Request body for Neural Route (JSON)"
              rows={8}
            />
          </>
        );

      case "neural_set_key":
        return (
          <>
            {commonFields}
            <Input
              value={activePayload.apiKey}
              onChange={(e) =>
                updatePayload(activePayload.id, { apiKey: e.target.value })
              }
              placeholder="API Key for Neural Service"
            />
          </>
        );

      case "neural_available":
        return (
          <>
            {commonFields}
            <p>No body required for this request.</p>
          </>
        );

      case "neural_model_info":
        return (
          <>
            {commonFields}
            <Input
              value={activePayload.model}
              onChange={(e) =>
                updatePayload(activePayload.id, { model: e.target.value })
              }
              placeholder="Model Name or ID"
            />
          </>
        );

      default:
        return (
          <>
            {commonFields}
            <Textarea
              value={activePayload.headers}
              onChange={(e) =>
                updatePayload(activePayload.id, { headers: e.target.value })
              }
              placeholder="Headers (JSON)"
              rows={4}
            />
            <Textarea
              value={activePayload.body}
              onChange={(e) =>
                updatePayload(activePayload.id, { body: e.target.value })
              }
              placeholder="Body (JSON)"
              rows={8}
            />
          </>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Control Buttons */}
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> New Payload
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => createPayload("add")}>
                Gravrag Add Data
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => createPayload("recall")}>
                Gravrag Recall Memory
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => createPayload("prune")}>
                Gravrag Prune
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => createPayload("other")}>
                Other
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => createPayload("neural_route")}>
                Neural Route Query
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => createPayload("neural_set_key")}
              >
                Neural Set API Key
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => createPayload("neural_available")}
              >
                Neural Available Models
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => createPayload("neural_model_info")}
              >
                Neural Model Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={createRoutine}
            variant="secondary"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> New Routine
          </Button>
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" /> Import Config
          </Button>
          <Button
            onClick={handleExportConfig}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" /> Export Config
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button
            onClick={executeAllPayloads}
            variant="default"
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" /> Execute All Payloads
          </Button>
          <Button
            onClick={executeAllRoutines}
            variant="secondary"
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" /> Execute All Routines
          </Button>
          <Button
            onClick={pushPayloadsToDB}
            variant="default"
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" /> Push All Payloads To DB
          </Button>
          <div className="col-span-2"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payload List */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
          <h2 className="text-2xl font-semibold mb-4">Payloads</h2>
          <div className="mb-4 flex space-x-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payloads..."
              className="flex-grow"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPayloads.map((payload, index) => (
              <div
                key={payload.id}
                className="bg-gray-700 bg-opacity-50 p-2 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                onClick={() => handleSetActivePayload(payload)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-between">
                  <span>{payload.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        executePayloadWithSubtasks(payload);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePayload(payload.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Payload Tab */}
        {activePayload && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Payload</h2>
            <div className="space-y-4">
              {renderPayloadEditWindow()}

              {/* Subtasks */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Subtasks</h3>
                {activePayload.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="bg-gray-700 bg-opacity-50 p-4 rounded mb-4"
                  >
                    <Input
                      value={subtask.name}
                      onChange={(e) =>
                        updateSubtask(activePayload.id, subtask.id, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Subtask Name"
                      className="mb-2"
                    />
                    <Input
                      value={subtask.url}
                      onChange={(e) =>
                        updateSubtask(activePayload.id, subtask.id, {
                          url: e.target.value,
                        })
                      }
                      placeholder="Subtask URL"
                      className="mb-2"
                    />
                    <select
                      value={subtask.method}
                      onChange={(e) =>
                        updateSubtask(activePayload.id, subtask.id, {
                          method: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-gray-600 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full mb-2"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <Textarea
                      value={subtask.body}
                      onChange={(e) =>
                        updateSubtask(activePayload.id, subtask.id, {
                          body: e.target.value,
                        })
                      }
                      placeholder="Subtask Body (JSON)"
                      rows={4}
                      className="mb-2"
                    />
                    <Button
                      onClick={() =>
                        deleteSubtask(activePayload.id, subtask.id)
                      }
                      variant="destructive"
                      size="sm"
                    >
                      Delete Subtask
                    </Button>
                  </div>
                ))}
                <Button onClick={() => addSubtask(activePayload.id)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Subtask
                </Button>
              </div>

              {/* Execution Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => executePayloadWithSubtasks(activePayload)}
                >
                  <Play className="mr-2 h-4 w-4" /> Execute Payload
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deletePayload(activePayload.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Payload
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(results).map(([id, result]) => (
              <div key={id} className="bg-gray-700 bg-opacity-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-2">
                  {result.payload.name}
                </h3>
                <p className="text-sm text-gray-300 mb-2">URL: {result.url}</p>
                <JSONViewer json={result.response} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JSON Structure Builder */}
      <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
        <h2 className="text-2xl font-semibold mb-4">JSON Structure Builder</h2>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search JSON structure..."
              className="mb-4"
            />
            <div className="bg-gray-700 bg-opacity-50 p-4 rounded max-h-96 overflow-y-auto">
              <TreeNode
                node={jsonStructure}
                onAdd={addNodeToJsonStructure}
                onDelete={deleteNodeFromJsonStructure}
                onToggle={toggleNodeInJsonStructure}
                onEdit={editNodeInJsonStructure}
                searchTerm={searchTerm}
              />
            </div>
          </div>
          <div className="w-1/2">
            <h3 className="text-xl font-semibold mb-2">JSON Output</h3>
            <JSONViewer json={jsonStructure} />
          </div>
        </div>
      </div>

      {/* Global Variables */}
      <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
        <h2 className="text-2xl font-semibold mb-4">Global Variables</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            placeholder="Variable Name"
          />
          <Input
            value={newVarValue}
            onChange={(e) => setNewVarValue(e.target.value)}
            placeholder="Variable Value"
          />
          <Button
            onClick={() => {
              if (newVarName && newVarValue) {
                setGlobalVariables({
                  ...globalVariables,
                  [newVarName]: newVarValue,
                });
                setNewVarName("");
                setNewVarValue("");
                toast.success("Global variable added.");
              }
            }}
          >
            Add Variable
          </Button>
        </div>
        <div className="space-y-2">
          {Object.entries(globalVariables).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between bg-gray-700 bg-opacity-50 p-2 rounded"
            >
              <span>
                {key}: {value}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updatedVars = { ...globalVariables };
                  delete updatedVars[key];
                  setGlobalVariables(updatedVars);
                  toast.success("Global variable removed.");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Routines */}
      <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
        <h2 className="text-2xl font-semibold mb-4">Routines</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Routine List</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-gray-700 bg-opacity-50 p-2 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => setActiveRoutine(routine)}
                >
                  <div className="flex items-center justify-between">
                    <span>{routine.name}</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          executeRoutine(routine);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoutine(routine.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {activeRoutine && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Edit Routine</h3>
              <Input
                value={activeRoutine.name}
                onChange={(e) =>
                  updateRoutine(activeRoutine.id, { name: e.target.value })
                }
                placeholder="Routine Name"
                className="mb-4"
              />
              <h4 className="text-lg font-semibold mb-2">Payloads</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeRoutine.payloads.map((payloadId) => {
                  const payload = payloads.find((p) => p.id === payloadId);
                  return (
                    payload && (
                      <div
                        key={payloadId}
                        className="flex items-center justify-between bg-gray-700 bg-opacity-50 p-2 rounded"
                      >
                        <span>{payload.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removePayloadFromRoutine(
                              activeRoutine.id,
                              payloadId
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  );
                })}
              </div>
              <select
                className="mt-4 px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                onChange={(e) =>
                  addPayloadToRoutine(activeRoutine.id, e.target.value)
                }
                value=""
              >
                <option value="" disabled>
                  Add payload to routine
                </option>
                {payloads
                  .filter((p) => !activeRoutine.payloads.includes(p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-2xl font-semibold mb-4">
              Import Configuration
            </h2>
            <Textarea
              value={importedConfig}
              onChange={(e) => setImportedConfig(e.target.value)}
              placeholder="Paste your configuration JSON here"
              rows={10}
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setIsImportModalOpen(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button onClick={handleImportConfig}>Import</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
