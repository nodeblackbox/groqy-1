"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "react-hot-toast";
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

// Custom UI Components
const Button = ({
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "flex items-center justify-center space-x-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105";
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    secondary: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
    destructive: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    success: "bg-gradient-to-r from-blue-500 to-green-500 text-white",
    ghost: "bg-transparent text-gray-200 hover:bg-gray-700",
    outline: "border border-gray-500 text-gray-200 hover:bg-gray-700",
  };
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xs: "px-1 py-0.5 text-xs",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({
  value,
  onChange,
  placeholder,
  className = "",
  icon,
  ...props
}) => (
  <div className={`relative ${className}`}>
    {icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
    )}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 pl-${
        icon ? "10" : "3"
      } bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500`}
      {...props}
    />
  </div>
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y ${className}`}
    {...props}
  />
);

// Main Page Component
export default function PayloadMakerUI2() {
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
  const [routines, setRoutines] = useState([]);
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [isAsyncExecution, setIsAsyncExecution] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [configs, setConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);

  // New state for shared memory
  const [sharedMemory, setSharedMemory] = useState({});

  // Refs for Drag-and-Drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Load from Local Storage on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
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
      const storedConfigs = JSON.parse(localStorage.getItem("configs") || "[]");
      const storedResults = JSON.parse(localStorage.getItem("results") || "{}");
      const storedSharedMemory = JSON.parse(
        localStorage.getItem("sharedMemory") || "{}"
      );

      if (storedPayloads.length) setPayloads(storedPayloads);
      if (Object.keys(storedGlobalVariables).length)
        setGlobalVariables(storedGlobalVariables);
      if (storedRoutines.length) setRoutines(storedRoutines);
      setJsonStructure(storedJsonStructure);
      if (storedConfigs.length) setConfigs(storedConfigs);
      if (Object.keys(storedResults).length) setResults(storedResults);
      if (Object.keys(storedSharedMemory).length)
        setSharedMemory(storedSharedMemory);
    }
  }, []);

  // Save to Local Storage on Changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("payloads", JSON.stringify(payloads));
      localStorage.setItem("globalVariables", JSON.stringify(globalVariables));
      localStorage.setItem("routines", JSON.stringify(routines));
      localStorage.setItem("jsonStructure", JSON.stringify(jsonStructure));
      localStorage.setItem("configs", JSON.stringify(configs));
      localStorage.setItem("results", JSON.stringify(results));
      localStorage.setItem("sharedMemory", JSON.stringify(sharedMemory));
    }
  }, [
    payloads,
    globalVariables,
    routines,
    jsonStructure,
    configs,
    results,
    sharedMemory,
  ]);

  // Function to handle payload execution with shared memory
  const handleSendPayload = async (payload, parentPayloadId = null) => {
    try {
      const headers = JSON.parse(payload.headers);
      if (useAuth) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
      }

      // Replace variables in URL, headers, and body, now including shared memory
      const interpolatedUrl = interpolateString(payload.url, {
        ...globalVariables,
        ...sharedMemory,
      });
      const interpolatedHeaders = interpolateObject(headers, {
        ...globalVariables,
        ...sharedMemory,
      });
      const interpolatedBody = payload.body
        ? interpolateString(payload.body, {
            ...globalVariables,
            ...sharedMemory,
          })
        : undefined;

      const response = await fetch(
        interpolatedUrl || "/api/qdrant/create-point",
        {
          method: payload.method,
          headers: interpolatedHeaders,
          body: payload.method !== "GET" ? interpolatedBody : undefined,
        }
      );

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Update shared memory with response data
      setSharedMemory((prevMemory) => ({
        ...prevMemory,
        [`${payload.name}_response`]: data,
      }));

      // If this is a subtask, store the result in the parent payload's shared memory
      if (parentPayloadId) {
        setPayloads((prevPayloads) => {
          return prevPayloads.map((p) => {
            if (p.id === parentPayloadId) {
              return {
                ...p,
                sharedMemory: {
                  ...p.sharedMemory,
                  [`${payload.name}_response`]: data,
                },
              };
            }
            return p;
          });
        });
      }

      setResults((prev) => ({
        ...prev,
        [payload.id]: { url: interpolatedUrl, payload, response: data },
      }));

      toast.success(`Payload "${payload.name}" sent successfully!`);
      return data;
    } catch (error) {
      console.error("Error sending payload:", error);
      setResults((prev) => ({
        ...prev,
        [payload.id]: {
          url: payload.url,
          payload,
          response: { error: error.message },
        },
      }));
      toast.error(`Failed to send payload "${payload.name}".`);
      return { error: error.message };
    }
  };

  // Function to execute payload with subtasks, now using shared memory
  const executePayloadWithSubtasks = async (payload) => {
    // Clear the payload's shared memory before execution
    setPayloads((prevPayloads) => {
      return prevPayloads.map((p) => {
        if (p.id === payload.id) {
          return { ...p, sharedMemory: {} };
        }
        return p;
      });
    });

    // Execute subtasks first
    if (payload.subtasks.length > 0) {
      if (isAsyncExecution) {
        await Promise.all(
          payload.subtasks.map(async (subtask) => {
            await handleSendPayload(
              { ...subtask, headers: payload.headers },
              payload.id
            );
          })
        );
      } else {
        for (const subtask of payload.subtasks) {
          await handleSendPayload(
            { ...subtask, headers: payload.headers },
            payload.id
          );
        }
      }
    }

    // Execute main payload
    const mainResult = await handleSendPayload(payload);

    // Update the payload's shared memory with the main result
    setPayloads((prevPayloads) => {
      return prevPayloads.map((p) => {
        if (p.id === payload.id) {
          return {
            ...p,
            sharedMemory: {
              ...p.sharedMemory,
              main_response: mainResult,
            },
          };
        }
        return p;
      });
    });
  };

  // Function to clear shared memory
  const clearSharedMemory = () => {
    setSharedMemory({});
    toast.success("Shared memory cleared.");
  };

  // Function to add or update a shared memory variable
  const updateSharedMemory = (key, value) => {
    setSharedMemory((prevMemory) => ({
      ...prevMemory,
      [key]: value,
    }));
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

  const addPayload = () => {
    const newPayload = {
      id: uuidv4(),
      name: "New Payload",
      url: "",
      method: "GET",
      headers: "{}",
      body: "",
      subtasks: [],
      sharedMemory: {},
    };
    setPayloads([...payloads, newPayload]);
  };

  const deletePayload = (id) => {
    setPayloads(payloads.filter((payload) => payload.id !== id));
  };

  const addRoutine = () => {
    const newRoutine = {
      id: uuidv4(),
      name: "New Routine",
      payloads: [],
    };
    setRoutines([...routines, newRoutine]);
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  const executeRoutine = async (routine) => {
    for (const payloadId of routine.payloads) {
      const payload = payloads.find((p) => p.id === payloadId);
      if (payload) {
        await executePayloadWithSubtasks(payload);
      }
    }
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDrop = (e) => {
    const copyListItems = [...payloads];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setPayloads(copyListItems);
  };

  const handleImport = () => {
    try {
      const importedData = JSON.parse(importedConfig);
      setPayloads(importedData.payloads || []);
      setRoutines(importedData.routines || []);
      setGlobalVariables(importedData.globalVariables || {});
      setConfigs([...configs, importedData]);
      setIsImportModalOpen(false);
      toast.success("Configuration imported successfully!");
    } catch (error) {
      toast.error("Failed to import configuration. Please check the format.");
    }
  };

  const handleExport = () => {
    const exportData = {
      payloads,
      routines,
      globalVariables,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);

    downloadAnchorNode.setAttribute("download", "config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredPayloads = payloads.filter((payload) =>
    payload.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPayloads = [...filteredPayloads].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // EditPayload component
  const EditPayload = ({ payload, onSave, onCancel }) => {
    const [editedPayload, setEditedPayload] = useState(payload);
    const [useSharedMemory, setUseSharedMemory] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedPayload((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubtaskChange = (index, field, value) => {
      const updatedSubtasks = [...editedPayload.subtasks];
      updatedSubtasks[index] = { ...updatedSubtasks[index], [field]: value };
      setEditedPayload((prev) => ({ ...prev, subtasks: updatedSubtasks }));
    };

    const addSubtask = () => {
      setEditedPayload((prev) => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          {
            id: uuidv4(),
            name: "",
            url: "",
            method: "GET",
            headers: "{}",
            body: "",
          },
        ],
      }));
    };

    const removeSubtask = (index) => {
      const updatedSubtasks = [...editedPayload.subtasks];
      updatedSubtasks.splice(index, 1);
      setEditedPayload((prev) => ({ ...prev, subtasks: updatedSubtasks }));
    };

    const handleSave = () => {
      onSave(editedPayload);
    };

    return (
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Edit Payload</h2>
        <Input
          name="name"
          value={editedPayload.name}
          onChange={handleInputChange}
          placeholder="Payload Name"
        />
        <Input
          name="url"
          value={editedPayload.url}
          onChange={handleInputChange}
          placeholder="URL"
        />
        <select
          name="method"
          value={editedPayload.method}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <TextArea
          name="headers"
          value={editedPayload.headers}
          onChange={handleInputChange}
          placeholder="Headers (JSON)"
        />
        <TextArea
          name="body"
          value={editedPayload.body}
          onChange={handleInputChange}
          placeholder="Body"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useSharedMemory"
            checked={useSharedMemory}
            onChange={(e) => setUseSharedMemory(e.target.checked)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <label htmlFor="useSharedMemory" className="text-white">
            Use Shared Memory in Body
          </label>
        </div>
        {useSharedMemory && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Available Shared Memory Variables:
            </h3>
            {Object.keys(editedPayload.sharedMemory || {}).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <span className="text-white">{key}:</span>
                <Button
                  onClick={() => {
                    setEditedPayload((prev) => ({
                      ...prev,
                      body: prev.body + `\${${key}}`,
                    }));
                  }}
                  size="sm"
                >
                  Insert
                </Button>
              </div>
            ))}
          </div>
        )}
        <h3 className="text-xl font-semibold mt-6 mb-2">Subtasks</h3>
        {editedPayload.subtasks.map((subtask, index) => (
          <div
            key={subtask.id}
            className="space-y-2 border border-gray-600 p-4 rounded-lg"
          >
            <Input
              value={subtask.name}
              onChange={(e) =>
                handleSubtaskChange(index, "name", e.target.value)
              }
              placeholder="Subtask Name"
            />
            <Input
              value={subtask.url}
              onChange={(e) =>
                handleSubtaskChange(index, "url", e.target.value)
              }
              placeholder="Subtask URL"
            />
            <select
              value={subtask.method}
              onChange={(e) =>
                handleSubtaskChange(index, "method", e.target.value)
              }
              className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <TextArea
              value={subtask.headers}
              onChange={(e) =>
                handleSubtaskChange(index, "headers", e.target.value)
              }
              placeholder="Subtask Headers (JSON)"
            />
            <TextArea
              value={subtask.body}
              onChange={(e) =>
                handleSubtaskChange(index, "body", e.target.value)
              }
              placeholder="Subtask Body"
            />
            <Button onClick={() => removeSubtask(index)} variant="destructive">
              Remove Subtask
            </Button>
          </div>
        ))}
        <Button onClick={addSubtask}>Add Subtask</Button>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Payload</Button>
        </div>
      </div>
    );
  };

  // EditRoutine component
  const EditRoutine = ({ routine, onSave, onCancel }) => {
    const [editedRoutine, setEditedRoutine] = useState(routine);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedRoutine((prev) => ({ ...prev, [name]: value }));
    };

    const addPayloadToRoutine = (payloadId) => {
      setEditedRoutine((prev) => ({
        ...prev,
        payloads: [...prev.payloads, payloadId],
      }));
    };

    const removePayloadFromRoutine = (payloadId) => {
      setEditedRoutine((prev) => ({
        ...prev,
        payloads: prev.payloads.filter((id) => id !== payloadId),
      }));
    };

    const handleSave = () => {
      onSave(editedRoutine);
    };

    return (
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Edit Routine</h2>
        <Input
          name="name"
          value={editedRoutine.name}
          onChange={handleInputChange}
          placeholder="Routine Name"
        />
        <h3 className="text-xl font-semibold mt-6 mb-2">Payloads in Routine</h3>
        {editedRoutine.payloads.map((payloadId) => {
          const payload = payloads.find((p) => p.id === payloadId);
          return (
            <div
              key={payloadId}
              className="flex items-center justify-between p-2 bg-gray-700 bg-opacity-50 rounded-lg"
            >
              <span>{payload ? payload.name : "Unknown Payload"}</span>
              <Button
                onClick={() => removePayloadFromRoutine(payloadId)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </div>
          );
        })}
        <select
          className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mt-4"
          onChange={(e) => {
            if (e.target.value) addPayloadToRoutine(e.target.value);
          }}
          value=""
        >
          <option value="">Add Payload to Routine</option>
          {payloads
            .filter((p) => !editedRoutine.payloads.includes(p.id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Routine</Button>
        </div>
      </div>
    );
  };

  // EditConfig component
  const EditConfig = ({ config, onSave, onCancel }) => {
    const [editedConfig, setEditedConfig] = useState(config);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedConfig((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
      onSave(editedConfig);
    };

    return (
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Edit Config</h2>
        <Input
          name="name"
          value={editedConfig.name}
          onChange={handleInputChange}
          placeholder="Config Name"
        />
        <TextArea
          name="description"
          value={editedConfig.description}
          onChange={handleInputChange}
          placeholder="Config Description"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Config</Button>
        </div>
      </div>
    );
  };

  // API Configuration component
  const APIConfiguration = () => {
    return (
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg space-y-4">
        <h2 className="text-2xl font-semibold mb-4">API Configuration</h2>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useAuth"
            checked={useAuth}
            onChange={(e) => setUseAuth(e.target.checked)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <label htmlFor="useAuth" className="text-white">
            Use Authentication
          </label>
        </div>
        {useAuth && (
          <Input
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
            placeholder="Bearer Token"
          />
        )}
      </div>
    );
  };

  // Global Variables component
  const GlobalVariables = () => {
    const [newVarName, setNewVarName] = useState("");
    const [newVarValue, setNewVarValue] = useState("");

    const addGlobalVariable = () => {
      if (newVarName && newVarValue) {
        setGlobalVariables((prev) => ({
          ...prev,
          [newVarName]: newVarValue,
        }));
        setNewVarName("");
        setNewVarValue("");
      }
    };

    const removeGlobalVariable = (key) => {
      setGlobalVariables((prev) => {
        const newVars = { ...prev };
        delete newVars[key];
        return newVars;
      });
    };

    return (
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Global Variables</h2>
        {Object.entries(globalVariables).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <Input value={key} readOnly className="w-1/3" />
            <Input value={value} readOnly className="w-1/3" />
            <Button
              onClick={() => removeGlobalVariable(key)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <Input
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            placeholder="Variable Name"
            className="w-1/3"
          />
          <Input
            value={newVarValue}
            onChange={(e) => setNewVarValue(e.target.value)}
            placeholder="Variable Value"
            className="w-1/3"
          />
          <Button onClick={addGlobalVariable}>Add Variable</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Control Buttons */}
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button onClick={addPayload} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> New Payload
          </Button>
          <Button onClick={addRoutine} variant="secondary" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> New Routine
          </Button>
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="success"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" /> Import Setup
          </Button>
          <Button onClick={handleExport} variant="success" className="w-full">
            <Download className="mr-2 h-4 w-4" /> Export Config
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Button
            onClick={() => {
              payloads.forEach((payload) =>
                executePayloadWithSubtasks(payload)
              );
            }}
            variant="primary"
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" /> Execute All Payloads
          </Button>
          <Button
            onClick={() => {
              routines.forEach((routine) => executeRoutine(routine));
            }}
            variant="secondary"
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" /> Execute All Routines
          </Button>
          <Button
            onClick={clearSharedMemory}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Shared Memory
          </Button>
        </div>
      </div>

      <div className="md:flex md:gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Payloads</h2>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payloads..."
              icon={<Search className="h-4 w-4 text-gray-400" />}
              className="mb-4"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
            </select>
            <div className="space-y-2">
              {sortedPayloads.map((payload, index) => (
                <div
                  key={payload.id}
                  className="flex items-center justify-between p-2 bg-gray-700 bg-opacity-50 rounded-lg"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDrop}
                >
                  <span>{payload.name}</span>
                  <div>
                    <Button
                      onClick={() => setActivePayload(payload)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => executePayloadWithSubtasks(payload)}
                      variant="ghost"
                      size="sm"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deletePayload(payload.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Routines</h2>
            <div className="space-y-2">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-2 bg-gray-700 bg-opacity-50 rounded-lg"
                >
                  <span>{routine.name}</span>
                  <div>
                    <Button
                      onClick={() => setActiveRoutine(routine)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => executeRoutine(routine)}
                      variant="ghost"
                      size="sm"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteRoutine(routine.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/4 space-y-6">
          {activePayload && (
            <EditPayload
              payload={activePayload}
              onSave={(updatedPayload) => {
                setPayloads((prevPayloads) =>
                  prevPayloads.map((p) =>
                    p.id === updatedPayload.id ? updatedPayload : p
                  )
                );
                setActivePayload(null);
              }}
              onCancel={() => setActivePayload(null)}
            />
          )}
          {activeRoutine && (
            <EditRoutine
              routine={activeRoutine}
              onSave={(updatedRoutine) => {
                setRoutines((prevRoutines) =>
                  prevRoutines.map((r) =>
                    r.id === updatedRoutine.id ? updatedRoutine : r
                  )
                );
                setActiveRoutine(null);
              }}
              onCancel={() => setActiveRoutine(null)}
            />
          )}
          {activeConfig && (
            <EditConfig
              config={activeConfig}
              onSave={(updatedConfig) => {
                setConfigs((prevConfigs) =>
                  prevConfigs.map((c) =>
                    c.id === updatedConfig.id ? updatedConfig : c
                  )
                );
                setActiveConfig(null);
              }}
              onCancel={() => setActiveConfig(null)}
            />
          )}
          <APIConfiguration />
          <GlobalVariables />
        </div>

        {/* Results Panel */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <div className="space-y-4">
              {Object.entries(results).map(([id, result]) => (
                <div
                  key={id}
                  className="bg-gray-700 bg-opacity-50 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {result.payload.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    URL: {result.url}
                  </p>
                  <pre className="bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              Import Configuration
            </h2>
            <TextArea
              value={importedConfig}
              onChange={(e) => setImportedConfig(e.target.value)}
              placeholder="Paste your configuration JSON here..."
              className="mb-4"
              rows={10}
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setIsImportModalOpen(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button onClick={handleImport}>Import</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
