# components

## Project Structure

```
mainDashboardComponents/
├── Button.jsx
├── FeatureProfile.jsx
├── NavButton.jsx
├── PROJECT_DOCUMENTATION.md
├── views/
│   ├── agentSwarm.jsx
│   ├── AGIAgentBuilderView.jsx
│   ├── AIWorkflowsView.jsx
│   ├── apiMaker.jsx
│   ├── BugTrackerView.jsx
│   ├── ChatbotView.jsx
│   ├── FileUploadsView.jsx
│   ├── GitHubIntegrationView.jsx
│   ├── HomeView.jsx
│   ├── IDEView.jsx
│   ├── KanbanBoardView.jsx
│   ├── nodebuilder.jsx
│   ├── PayloadMakerUI2.jsx
│   ├── promptHelper.jsx
│   ├── SettingsView.jsx
│   ├── TaskManagementView.jsx
│   ├── taskManagerAdmin.jsx
│   ├── taskManagerGanttChart.jsx
│   ├── TeamCollaborationView.jsx
│   ├── WorkflowBuilderView.jsx
```

## File Contents and Implementation Guidelines

### `Button.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/Button.jsx

"use client";

import React from "react";

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

export default Button;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\Button.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `FeatureProfile.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/FeatureProfile.jsx

"use client";

import React from "react";

const FeatureProfile = () => (
    <div className="mb-8 bg-gradient-to-r from-gray-700 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center space-x-4">
            <div className="relative">
                <img
                    src="https://i.ibb.co/tDxBcPq/Pitch-Deck-Logo-Asset-V7.png"
                    alt="User"
                    className="w-16 h-16 rounded-full ring-4 ring-purple-500 shadow-lg transform hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <div className="bg-green-300 rounded-full w-3 h-3"></div>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">CeeCee</span>
                <p className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full inline-block">
                    CTO
                </p>
            </div>
        </div>
    </div>
);

export default FeatureProfile;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\FeatureProfile.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `NavButton.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/NavButton.jsx

"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Transition } from "@headlessui/react";

const NavButton = ({
    children,
    icon: Icon,
    onClick,
    isActive,
    dropdown,
    dropdownItems,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (dropdown)
        {
            setIsOpen(!isOpen);
        } else
        {
            onClick();
        }
    };

    return (
        <div className="w-full">
            <button
                className={`w-full p-3 text-left rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-between ${isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-purple-500 to-blue-500"
                    }`}
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <Icon className="mr-3" size={20} />
                    <span>{children}</span>
                </div>
                {dropdown && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </button>
            {dropdown && isOpen && (
                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <div className="mt-2 space-y-2 pl-8">
                        {dropdownItems.map((item) => (
                            <button
                                key={item.label}
                                className={`w-full p-2 text-left rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out ${isActive === item.value
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                    : "bg-gradient-to-r from-purple-400 to-blue-400"
                                    }`}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </Transition>
            )}
        </div>
    );
};

export default NavButton;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\NavButton.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\agentSwarm.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/agentSwarm.jsx

"use client";

import React, { useState } from "@/components/mainDashboardComponents/Button";
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

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\agentSwarm.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\AGIAgentBuilderView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/AGIAgentBuilderView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const AGIAgentBuilderView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AGI Agent Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create New AGI Agent */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New AGI Agent</h3>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Agent Name"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                        placeholder="Agent Description"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                    ></textarea>
                    <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Select Base Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <Button variant="primary" className="w-full">
                        Create Agent
                    </Button>
                </form>
            </div>

            {/* Active AGI Agents */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Active AGI Agents</h3>
                <ul className="space-y-2">
                    {[
                        { name: "Code Reviewer", type: "Development", status: "Active" },
                        { name: "Data Analyzer", type: "Analytics", status: "Training" },
                        { name: "Customer Support", type: "Service", status: "Active" },
                        { name: "Content Generator", type: "Marketing", status: "Inactive" },
                    ].map((agent, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{agent.name}</p>
                                <p className="text-sm text-gray-400">{agent.type}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${agent.status === "Active"
                                    ? "bg-green-500"
                                    : agent.status === "Training"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                            >
                                {agent.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default AGIAgentBuilderView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\AGIAgentBuilderView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\AIWorkflowsView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/AIWorkflowsView.jsx

"use client";

import React from "react";
import Button from "@/components/mainDashboardComponents/Button";

const AIWorkflowsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AI Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Active Workflows</h3>
                <ul className="space-y-2">
                    {[
                        "Code Review Assistant",
                        "Bug Prediction Model",
                        "Automated Testing Pipeline",
                        "Performance Optimization Analyzer",
                    ].map((workflow, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <span>{workflow}</span>
                            <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
                                Active
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Workflow name"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Select AI Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <Button variant="primary" className="w-full">
                        Create Workflow
                    </Button>
                </form>
            </div>
        </div>
    </div>
);

export default AIWorkflowsView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\AIWorkflowsView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\apiMaker.jsx`

#### File Content:
```jsx
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

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\apiMaker.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\BugTrackerView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/BugTrackerView.jsx

"use client";

import React from "react";

const BugTrackerView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Bug Tracker</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-xl shadow-lg">
                <thead>
                    <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Severity</th>
                        <th className="p-3 text-left">Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        {
                            id: "BUG-001",
                            description: "Login page not responsive on mobile",
                            status: "Open",
                            severity: "High",
                            assignedTo: "John Doe",
                        },
                        {
                            id: "BUG-002",
                            description: "Database connection timeout",
                            status: "In Progress",
                            severity: "Critical",
                            assignedTo: "Jane Smith",
                        },
                        {
                            id: "BUG-003",
                            description: "Incorrect calculation in billing module",
                            status: "Resolved",
                            severity: "Medium",
                            assignedTo: "Bob Johnson",
                        },
                    ].map((bug) => (
                        <tr key={bug.id} className="border-t border-gray-700">
                            <td className="p-3">{bug.id}</td>
                            <td className="p-3">{bug.description}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${bug.status === "Open"
                                        ? "bg-red-500"
                                        : bug.status === "In Progress"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                        }`}
                                >
                                    {bug.status}
                                </span>
                            </td>
                            <td className="p-3">{bug.severity}</td>
                            <td className="p-3">{bug.assignedTo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default BugTrackerView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\BugTrackerView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\ChatbotView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/ChatbotView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const ChatbotView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AI Chatbot</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
            {/* Chat History */}
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                {[
                    { sender: "bot", message: "Hello! How can I assist you today?" },
                    { sender: "user", message: "I need help with creating a new workflow." },
                    {
                        sender: "bot",
                        message:
                            "I can guide you through the process of creating a new workflow. What type of workflow are you looking to create?",
                    },
                    { sender: "user", message: "I want to create an automated code review workflow." },
                    {
                        sender: "bot",
                        message:
                            "Great choice! An automated code review workflow can significantly improve your development process. Here are the steps to create one:",
                    },
                    {
                        sender: "bot",
                        message:
                            '1. Go to the AI Workflows section\n2. Click on "Create New Workflow"\n3. Select "Code Review" as the workflow type\n4. Configure the parameters such as programming language, review criteria, and notification settings\n5. Set up the trigger events (e.g., new pull request)\n6. Save and activate the workflow',
                    },
                    { sender: "user", message: "Thanks! Can you explain more about the review criteria?" },
                    {
                        sender: "bot",
                        message:
                            "The review criteria are the rules and standards that the AI will use to evaluate the code. This can include:",
                    },
                    {
                        sender: "bot",
                        message:
                            "- Code style and formatting\n- Potential bugs or errors\n- Code complexity and maintainability\n- Security vulnerabilities\n- Performance optimizations\n\nYou can customize these criteria based on your team's specific needs and coding standards.",
                    },
                ].map((chat, index) => (
                    <div
                        key={index}
                        className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-3/4 p-3 rounded-lg ${chat.sender === "user" ? "bg-purple-600" : "bg-gray-700"
                                }`}
                        >
                            {chat.message.split("\n").map((line, idx) => (
                                <span key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-grow p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button variant="primary">Send</Button>
            </div>
        </div>
    </div>
);

export default ChatbotView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\ChatbotView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\FileUploadsView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/FileUploadsView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const FileUploadsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">File Uploads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload New File */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Upload New File</h3>
                <form className="space-y-4">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-600 transition-colors">
                        <p>Drag and drop files here or click to select</p>
                        <input type="file" className="hidden" />
                    </div>
                    <Button variant="primary" className="w-full">
                        Upload
                    </Button>
                </form>
            </div>

            {/* Recent Uploads */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
                <ul className="space-y-2">
                    {[
                        { name: "project_requirements.pdf", size: "2.5 MB", date: "2023-06-15" },
                        { name: "design_mockup.psd", size: "15.7 MB", date: "2023-06-14" },
                        { name: "database_schema.sql", size: "4.2 KB", date: "2023-06-13" },
                        { name: "api_documentation.md", size: "18.9 KB", date: "2023-06-12" },
                    ].map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <span>{file.name}</span>
                            <div className="text-sm text-gray-400">
                                <span>{file.size}</span>
                                <span className="mx-2">|</span>
                                <span>{file.date}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default FileUploadsView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\FileUploadsView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\GitHubIntegrationView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/GitHubIntegrationView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const GitHubIntegrationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">GitHub Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connected Repositories */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Connected Repositories</h3>
                <ul className="space-y-2">
                    {[
                        { name: "frontend-app", status: "Connected", lastSync: "5 minutes ago" },
                        { name: "backend-api", status: "Connected", lastSync: "1 hour ago" },
                        { name: "mobile-app", status: "Disconnected", lastSync: "N/A" },
                        { name: "data-processing", status: "Connected", lastSync: "3 days ago" },
                    ].map((repo, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{repo.name}</p>
                                <p className="text-sm text-gray-400">Last synced: {repo.lastSync}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${repo.status === "Connected" ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                {repo.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent GitHub Activities */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Recent GitHub Activities</h3>
                <ul className="space-y-4">
                    {[
                        {
                            action: "Opened Pull Request",
                            repo: "frontend-app",
                            user: "John Doe",
                            time: "10 minutes ago",
                        },
                        {
                            action: "Merged Branch",
                            repo: "backend-api",
                            user: "Jane Smith",
                            time: "1 hour ago",
                        },
                        {
                            action: "Pushed Commit",
                            repo: "data-processing",
                            user: "Bob Johnson",
                            time: "3 hours ago",
                        },
                        {
                            action: "Created Issue",
                            repo: "frontend-app",
                            user: "Alice Williams",
                            time: "Yesterday",
                        },
                    ].map((activity, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>
                                {activity.user} {activity.action} in {activity.repo}
                            </span>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default GitHubIntegrationView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\GitHubIntegrationView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\HomeView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/HomeView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";
import { FileText, Zap, Bug, Users } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const taskData = [
    { name: "Mon", tasks: 12, bugs: 5, workflows: 3 },
    { name: "Tue", tasks: 19, bugs: 3, workflows: 5 },
    { name: "Wed", tasks: 15, bugs: 7, workflows: 4 },
    { name: "Thu", tasks: 22, bugs: 2, workflows: 6 },
    { name: "Fri", tasks: 18, bugs: 4, workflows: 5 },
    { name: "Sat", tasks: 10, bugs: 1, workflows: 2 },
    { name: "Sun", tasks: 8, bugs: 0, workflows: 1 },
];

const HomeView = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Tasks Created", value: "5", icon: FileText },
                        { label: "AI Generations", value: "12", icon: Zap },
                        { label: "Open Bugs", value: "28", icon: Bug },
                        { label: "Team Members", value: "85%", icon: Users },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="flex items-center mb-2">
                                <item.icon className="mr-2" size={20} />
                                <h3 className="text-sm text-gray-400">{item.label}</h3>
                            </div>
                            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Workflow Performance Chart */}
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Workflow Performance</h3>
                    <h4 className="text-sm text-gray-400 mb-4">
                        Performance Metrics in Last 7 Days
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={taskData}>
                            <XAxis dataKey="name" stroke="#ffffff" />
                            <YAxis stroke="#ffffff" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="tasks"
                                name="Tasks"
                                stroke="#8884d8"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="bugs"
                                name="Bugs"
                                stroke="#82ca9d"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="workflows"
                                name="Workflows"
                                stroke="#ffc658"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-8">
                {/* Recent Activities */}
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                    <ul className="space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                        {[
                            "New AI workflow created for optimization",
                            "Bug #127 fixed and deployed to production",
                            "Team meeting scheduled for project kickoff",
                            "New team member onboarded to the platform",
                        ].map((activity, index) => (
                            <li key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>{activity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Create New Task", icon: FileText },
                            { label: "Generate Workflow", icon: Zap },
                            { label: "Report a Bug", icon: Bug },
                            { label: "Invite Team Member", icon: Users },
                        ].map((item) => (
                            <Button
                                key={item.label}
                                variant="primary"
                                className="flex items-center justify-start p-3"
                            >
                                <item.icon className="mr-3" size={20} />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HomeView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\HomeView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\IDEView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/IDEView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const IDEView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Integrated Development Environment</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
            {/* Tabs for Files */}
            <div className="flex space-x-2 mb-4">
                <button className="px-4 py-2 bg-gray-700 rounded-t-lg">main.js</button>
                <button className="px-4 py-2 bg-gray-600 rounded-t-lg">styles.css</button>
                <button className="px-4 py-2 bg-gray-600 rounded-t-lg">index.html</button>
            </div>

            {/* Code Editor */}
            <div className="flex-grow bg-gray-900 p-4 font-mono text-sm overflow-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                <pre className="text-green-400">
                    {`// Main application code
function initApp() {
    console.log("Initializing application...");
    // Add your code here
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    initApp();
});

// Example function
function exampleFunction(param1, param2) {
    return param1 + param2;
}

// Export modules
export { initApp, exampleFunction };`}
                </pre>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between">
                <Button variant="primary">Run</Button>
                <Button variant="success">Save</Button>
            </div>
        </div>
    </div>
);

export default IDEView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\IDEView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\KanbanBoardView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/KanbanBoardView.jsx

"use client";

import React, { useState } from "@components/mainDashboardComponents/Button";

const KanbanBoardView = () => {
    const [tasks, setTasks] = useState({
        todo: [
            { id: 1, title: "Design new landing page" },
            { id: 2, title: "Implement user authentication" },
        ],
        inProgress: [
            { id: 3, title: "Optimize database queries" },
            { id: 4, title: "Create API documentation" },
        ],
        done: [
            { id: 5, title: "Set up CI/CD pipeline" },
            { id: 6, title: "Write unit tests for core modules" },
        ],
    });

    const onDragStart = (e, id) => {
        e.dataTransfer.setData("text/plain", id);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, category) => {
        const id = e.dataTransfer.getData("text");
        const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
        const task = allTasks.find((task) => task.id === parseInt(id));

        if (!task) return;

        const newTasks = {
            todo: tasks.todo.filter((task) => task.id !== parseInt(id)),
            inProgress: tasks.inProgress.filter((task) => task.id !== parseInt(id)),
            done: tasks.done.filter((task) => task.id !== parseInt(id)),
        };

        newTasks[category] = [...newTasks[category], task];
        setTasks(newTasks);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Kanban Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(tasks).map((category) => (
                    <div
                        key={category}
                        className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, category)}
                    >
                        <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                        <ul className="space-y-2">
                            {tasks[category].map((task) => (
                                <li
                                    key={task.id}
                                    className="bg-gray-700 p-3 rounded-lg cursor-move"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, task.id)}
                                >
                                    {task.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoardView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\KanbanBoardView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\nodebuilder.jsx`

#### File Content:
```jsx
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

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\nodebuilder.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\PayloadMakerUI2.jsx`

#### File Content:
```jsx
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
            className={`w-full px-3 py-2 pl-${icon ? "10" : "3"
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

// TreeNode Component for JSON Structure Builder
const TreeNode = ({ node, onAdd, onDelete, onToggle, onEdit, searchTerm }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(node.name);

    const handleEdit = (e) => {
        if (e.key === "Enter")
        {
            onEdit(node.id, "name", fieldValue);
            setIsEditing(false);
        }
    };

    const matchesSearch = (name) => {
        if (!searchTerm) return true;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    };

    if (!matchesSearch(node.name))
    {
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
                            <ChevronDown size={16} />
                        ) : (
                            <ChevronRight size={16} />
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
                        size="xs"
                        variant="ghost"
                        onClick={() => onAdd(node.id)}
                        className="h-6 w-6 p-0"
                    >
                        <Plus size={12} />
                    </Button>
                    {node.id !== "root" && (
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => onDelete(node.id)}
                            className="h-6 w-6 p-0"
                        >
                            <Trash2 size={12} />
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

// Main Page Component
export default function PayloadMakerUI2() {
    // State Variables without Local Storage Initialization
    const [url, setUrl] = useState(""); // Default to empty string
    const [payloads, setPayloads] = useState([]); // Start with empty array
    const [activePayload, setActivePayload] = useState(null);
    const [results, setResults] = useState([]); // Start with empty array
    const [useAuth, setUseAuth] = useState(false); // Default to false
    const [bearerToken, setBearerToken] = useState("");
    const [jsonStructure, setJsonStructure] = useState({
        id: "root",
        name: "root",
        children: [],
        isOpen: true,
    }); // Default structure
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
    const [configs, setConfigs] = useState([]);
    const [activeConfig, setActiveConfig] = useState(null);

    // Refs for Drag-and-Drop
    const dragItem = useRef();
    const dragOverItem = useRef();

    // Load from Local Storage on Mount (only in client)
    useEffect(() => {
        if (typeof window !== "undefined")
        {
            // Check if running in the browser
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
            const storedResults = JSON.parse(localStorage.getItem("results") || "[]");

            // Set state only if stored data exists
            if (storedPayloads.length) setPayloads(storedPayloads);
            if (Object.keys(storedGlobalVariables).length)
                setGlobalVariables(storedGlobalVariables);
            if (storedRoutines.length) setRoutines(storedRoutines);
            setJsonStructure(storedJsonStructure); // Always set, as it has a default
            if (storedConfigs.length) setConfigs(storedConfigs);
            if (storedResults.length) setResults(storedResults);

            console.log("Loaded data from localStorage:", {
                payloads: storedPayloads,
                globalVariables: storedGlobalVariables,
                routines: storedRoutines,
                jsonStructure: storedJsonStructure,
                configs: storedConfigs,
                results: storedResults,
            });
        }
    }, []); // Run only once on component mount

    // Save to Local Storage on Changes
    useEffect(() => {
        if (typeof window !== "undefined")
        {
            // Ensure localStorage is available
            try
            {
                localStorage.setItem("payloads", JSON.stringify(payloads));
                localStorage.setItem(
                    "globalVariables",
                    JSON.stringify(globalVariables)
                );
                localStorage.setItem("routines", JSON.stringify(routines));
                localStorage.setItem("jsonStructure", JSON.stringify(jsonStructure));
                localStorage.setItem("configs", JSON.stringify(configs));
                localStorage.setItem("results", JSON.stringify(results));
            } catch (error)
            {
                console.error("Error saving to localStorage:", error);
            }
        }
    }, [payloads, globalVariables, routines, jsonStructure, configs, results]);
    // Payload Management Functions
    const createPayload = () => {
        const newPayload = {
            id: uuidv4(),
            name: `Payload ${payloads.length + 1}`,
            description: "",
            url: "",
            method: "GET",
            headers: "{}",
            body: "{}",
            subtasks: [],
            createdAt: new Date().toISOString(),
        };
        const updatedPayloads = [...payloads, newPayload];
        setPayloads(updatedPayloads);
        setActivePayload(newPayload);
        localStorage.setItem("payloads", JSON.stringify(updatedPayloads));
        toast.success("New payload created.");
    };

    const updatePayload = (id, updates) => {
        const updatedPayloads = payloads.map((p) =>
            p.id === id ? { ...p, ...updates } : p
        );
        setPayloads(updatedPayloads);
        if (activePayload && activePayload.id === id)
        {
            setActivePayload({ ...activePayload, ...updates });
        }
        localStorage.setItem("payloads", JSON.stringify(updatedPayloads));
    };

    const deletePayload = (id) => {
        if (confirm("Are you sure you want to delete this payload?"))
        {
            const updatedPayloads = payloads.filter((p) => p.id !== id);
            setPayloads(updatedPayloads);
            if (activePayload && activePayload.id === id)
            {
                setActivePayload(null);
            }
            localStorage.setItem("payloads", JSON.stringify(updatedPayloads));
            toast.success("Payload deleted.");
        }
    };

    const addSubtask = (payloadId) => {
        const payload = payloads.find((p) => p.id === payloadId);
        if (payload)
        {
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
        if (payload)
        {
            const updatedSubtasks = payload.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, ...updates } : st
            );
            updatePayload(payloadId, { subtasks: updatedSubtasks });
        }
    };

    const deleteSubtask = (payloadId, subtaskId) => {
        if (confirm("Are you sure you want to delete this subtask?"))
        {
            const payload = payloads.find((p) => p.id === payloadId);
            if (payload)
            {
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
            if (node.id === parentId)
            {
                node.children = [...(node.children || []), newNode];
                return true;
            }
            if (node.children)
            {
                for (let child of node.children)
                {
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
            if (node.children)
            {
                node.children = node.children.filter((child) => child.id !== nodeId);
                node.children.forEach(deleteNodeRecursive);
            }
        };
        const newStructure = { ...jsonStructure };
        if (newStructure.id === nodeId)
        {
            toast.error("Cannot delete root node.");
            return;
        }
        deleteNodeRecursive(newStructure);
        setJsonStructure(newStructure);
        toast.success("Node deleted from JSON structure.");
    };

    const toggleNodeInJsonStructure = (nodeId) => {
        const toggleNodeRecursive = (node) => {
            if (node.id === nodeId)
            {
                node.isOpen = !node.isOpen;
                return true;
            }
            if (node.children)
            {
                for (let child of node.children)
                {
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
            if (node.id === nodeId)
            {
                node[field] = value;
                return true;
            }
            if (node.children)
            {
                for (let child of node.children)
                {
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
        if (activeRoutine && activeRoutine.id === id)
        {
            setActiveRoutine({ ...activeRoutine, ...updates });
        }
    };

    const deleteRoutine = (id) => {
        if (confirm("Are you sure you want to delete this routine?"))
        {
            setRoutines(routines.filter((r) => r.id !== id));
            if (activeRoutine && activeRoutine.id === id)
            {
                setActiveRoutine(null);
            }
            toast.success("Routine deleted.");
        }
    };

    const addPayloadToRoutine = (routineId, payloadId) => {
        const routine = routines.find((r) => r.id === routineId);
        if (routine && !routine.payloads.includes(payloadId))
        {
            updateRoutine(routineId, { payloads: [...routine.payloads, payloadId] });
            toast.success("Payload added to routine.");
        }
    };

    const removePayloadFromRoutine = (routineId, payloadId) => {
        const routine = routines.find((r) => r.id === routineId);
        if (routine)
        {
            const updatedPayloads = routine.payloads.filter((id) => id !== payloadId);
            updateRoutine(routineId, { payloads: updatedPayloads });
            toast.success("Payload removed from routine.");
        }
    };

    const executeRoutine = async (routine) => {
        toast.loading("Executing routine...", { id: "routineExecution" });
        for (const payloadId of routine.payloads)
        {
            const payload = payloads.find((p) => p.id === payloadId);
            if (payload)
            {
                await executePayloadWithSubtasks(payload);
            }
        }
        toast.success("Routine executed successfully!", { id: "routineExecution" });
    };

    // Payload Execution
    const handleSendPayload = async (payload) => {
        try
        {
            const headers = JSON.parse(payload.headers);
            if (useAuth)
            {
                headers["Authorization"] = `Bearer ${bearerToken}`;
            }

            // Replace variables in URL, headers, and body
            const interpolatedUrl = interpolateString(payload.url, globalVariables);
            const interpolatedHeaders = interpolateObject(headers, globalVariables);
            const interpolatedBody = payload.body
                ? interpolateString(payload.body, globalVariables)
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
            if (contentType && contentType.includes("application/json"))
            {
                data = await response.json();
            } else
            {
                data = await response.text();
            }

            setResults((prev) => ({
                ...prev,
                [payload.id]: { url: interpolatedUrl, payload, response: data },
            }));

            toast.success(`Payload "${payload.name}" sent successfully!`);
            return data;
        } catch (error)
        {
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

    const executePayloadWithSubtasks = async (payload) => {
        const mainResult = await handleSendPayload(payload);
        if (payload.subtasks.length > 0)
        {
            if (isAsyncExecution)
            {
                await Promise.all(
                    payload.subtasks.map(async (subtask) => {
                        await handleSendPayload({ ...subtask, headers: payload.headers });
                    })
                );
            } else
            {
                for (const subtask of payload.subtasks)
                {
                    await handleSendPayload({ ...subtask, headers: payload.headers });
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
        for (const key in obj)
        {
            const value = obj[key];
            if (typeof value === "string")
            {
                result[key] = interpolateString(value, variables);
            } else
            {
                result[key] = value;
            }
        }
        return result;
    };

    const handleImportConfig = () => {
        try
        {
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
            setConfigs(config.configs || []);
            setIsImportModalOpen(false);
            toast.success("Configuration imported successfully!");
        } catch (error)
        {
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
            configs,
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
        if (sortOption === "name")
        {
            return a.name.localeCompare(b.name);
        } else if (sortOption === "date")
        {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
    });

    const filteredPayloads = sortedPayloads.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Execute All Payloads
    const executeAllPayloads = async () => {
        if (payloads.length === 0)
        {
            toast.error("No payloads to execute.");
            return;
        }
        toast.loading("Executing all payloads...", { id: "executeAll" });
        for (const payload of payloads)
        {
            await executePayloadWithSubtasks(payload);
        }
        toast.success("All payloads executed successfully!", { id: "executeAll" });
    };

    const saveConfig = () => {
        if (activeConfig)
        {
            const updatedConfigs = configs.map((c) =>
                c.id === activeConfig.id ? { ...activeConfig } : c
            );
            setConfigs(updatedConfigs);
            localStorage.setItem("configs", JSON.stringify(updatedConfigs));
            toast.success("Configuration saved successfully!");
        } else
        {
            toast.error("No active configuration to save.");
        }
    };

    // Execute All Routines
    const executeAllRoutines = async () => {
        if (routines.length === 0)
        {
            toast.error("No routines to execute.");
            return;
        }
        toast.loading("Executing all routines...", { id: "executeAllRoutines" });
        for (const routine of routines)
        {
            await executeRoutine(routine);
        }
        toast.success("All routines executed successfully!", {
            id: "executeAllRoutines",
        });
    };

    // Config Management
    const createConfig = () => {
        const newConfig = {
            id: uuidv4(),
            name: `Config ${configs.length + 1}`,
            routines: [],
            createdAt: new Date().toISOString(),
        };
        setConfigs([...configs, newConfig]);
        setActiveConfig(newConfig);
        toast.success("New config created.");
    };

    const updateConfig = (id, updates) => {
        setConfigs(configs.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        if (activeConfig && activeConfig.id === id)
        {
            setActiveConfig({ ...activeConfig, ...updates });
        }
    };

    const deleteConfig = (id) => {
        if (confirm("Are you sure you want to delete this config?"))
        {
            setConfigs(configs.filter((c) => c.id !== id));
            if (activeConfig && activeConfig.id === id)
            {
                setActiveConfig(null);
            }
            toast.success("Config deleted.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 min-h-screen font-sans">
            <Toaster position="top-right" />

            {/* Control Buttons */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Button onClick={createPayload} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> New Payload
                    </Button>
                    <Button
                        onClick={createRoutine}
                        variant="secondary"
                        className="w-full"
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Routine
                    </Button>
                    <Button onClick={createConfig} variant="success" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> New Config
                    </Button>
                    <Button
                        onClick={() => setIsImportModalOpen(true)}
                        variant="success"
                        className="w-full"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Import Setup
                    </Button>
                    <Button
                        onClick={handleExportConfig}
                        variant="destructive"
                        className="w-full"
                    >
                        <Download className="mr-2 h-4 w-4" /> Export Config
                    </Button>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Button
                        onClick={executeAllPayloads}
                        variant="primary"
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
                </div>
            </div>

            <div className="md:flex md:gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Payloads</h2>
                        <div className="mb-4 flex items-center space-x-2">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Payloads"
                                className="flex-1"
                                icon={<Search size={16} />}
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
                        <ul className="space-y-2 max-h-96 overflow-auto">
                            {filteredPayloads.map((payload, index) => (
                                <li
                                    key={payload.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`p-2 rounded cursor-pointer ${activePayload && activePayload.id === payload.id
                                        ? "bg-blue-600"
                                        : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                    onClick={() => {
                                        setActivePayload(payload);
                                        setActiveRoutine(null);
                                        setActiveConfig(null);
                                    }}
                                >
                                    {payload.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Routines Section */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Routines</h2>
                        <ul className="space-y-2">
                            {routines.map((routine) => (
                                <li
                                    key={routine.id}
                                    className={`p-2 rounded cursor-pointer ${activeRoutine && activeRoutine.id === routine.id
                                        ? "bg-green-600"
                                        : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                    onClick={() => {
                                        setActiveRoutine(routine);
                                        setActivePayload(null);
                                        setActiveConfig(null);
                                    }}
                                >
                                    {routine.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Configs Section */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">Configs</h2>
                        <ul className="space-y-2">
                            {configs.map((config) => (
                                <li
                                    key={config.id}
                                    className="flex items-center justify-between p-2 rounded cursor-pointer bg-gray-700 hover:bg-gray-600"
                                >
                                    <span
                                        onClick={() => {
                                            setActiveConfig(config);
                                            setActivePayload(null);
                                            setActiveRoutine(null);
                                        }}
                                        className={`flex-grow ${activeConfig && activeConfig.id === config.id
                                            ? "text-green-400"
                                            : ""
                                            }`}
                                    >
                                        {config.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-2/4 space-y-6">
                    {/* API Configuration */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">API Configuration</h2>
                        <div className="space-y-4">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter API URL"
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={useAuth}
                                    onChange={() => setUseAuth(!useAuth)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label>Use Authentication</label>
                            </div>
                            {useAuth && (
                                <Input
                                    value={bearerToken}
                                    onChange={(e) => setBearerToken(e.target.value)}
                                    placeholder="Enter Bearer Token"
                                />
                            )}
                        </div>
                    </div>

                    {/* Edit Payload */}
                    {activePayload && (
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                            <h2 className="text-2xl font-semibold mb-4">Edit Payload</h2>
                            <div className="space-y-4">
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
                                        updatePayload(activePayload.id, {
                                            description: e.target.value,
                                        })
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
                                <TextArea
                                    value={activePayload.headers}
                                    onChange={(e) =>
                                        updatePayload(activePayload.id, { headers: e.target.value })
                                    }
                                    placeholder="Headers (JSON)"
                                    rows={4}
                                />
                                <TextArea
                                    value={activePayload.body}
                                    onChange={(e) =>
                                        updatePayload(activePayload.id, { body: e.target.value })
                                    }
                                    placeholder="Body (JSON)"
                                    rows={8}
                                />

                                {/* Subtasks */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Subtasks</h3>
                                    {activePayload.subtasks.map((subtask) => (
                                        <div
                                            key={subtask.id}
                                            className="bg-gray-700 bg-opacity-50 p-4 rounded mb-4"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <Input
                                                    value={subtask.name}
                                                    onChange={(e) =>
                                                        updateSubtask(activePayload.id, subtask.id, {
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Subtask Name"
                                                    className="w-2/3"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteSubtask(activePayload.id, subtask.id)
                                                    }
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                            <Input
                                                value={subtask.url}
                                                onChange={(e) =>
                                                    updateSubtask(activePayload.id, subtask.id, {
                                                        url: e.target.value,
                                                    })
                                                }
                                                placeholder="Subtask API URL"
                                                className="mb-2"
                                            />
                                            <select
                                                value={subtask.method}
                                                onChange={(e) =>
                                                    updateSubtask(activePayload.id, subtask.id, {
                                                        method: e.target.value,
                                                    })
                                                }
                                                className="px-3 py-2 bg-gray-600 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 w-full"
                                            >
                                                <option value="GET">GET</option>
                                                <option value="POST">POST</option>
                                                <option value="PUT">PUT</option>
                                                <option value="DELETE">DELETE</option>
                                            </select>
                                            <TextArea
                                                value={subtask.headers}
                                                onChange={(e) =>
                                                    updateSubtask(activePayload.id, subtask.id, {
                                                        headers: e.target.value,
                                                    })
                                                }
                                                placeholder="Subtask Headers (JSON)"
                                                rows={2}
                                                className="mb-2"
                                            />
                                            <TextArea
                                                value={subtask.body}
                                                onChange={(e) =>
                                                    updateSubtask(activePayload.id, subtask.id, {
                                                        body: e.target.value,
                                                    })
                                                }
                                                placeholder="Subtask Body (JSON)"
                                                rows={4}
                                            />
                                        </div>
                                    ))}
                                    <Button onClick={() => addSubtask(activePayload.id)}>
                                        <Plus size={16} className="mr-1" /> Add Subtask
                                    </Button>
                                </div>

                                {/* Execution Buttons */}
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => executePayloadWithSubtasks(activePayload)}
                                    >
                                        <Play size={16} className="mr-1" /> Execute Payload
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => deletePayload(activePayload.id)}
                                    >
                                        <Trash2 size={16} className="mr-1" /> Delete Payload
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* JSON Structure */}
                    {!activePayload && !activeRoutine && !activeConfig && (
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Dynamic JSON Builder</h2>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const jsonStr = JSON.stringify(jsonStructure, null, 2);
                                            navigator.clipboard.writeText(jsonStr);
                                            toast.success("JSON copied to clipboard.");
                                        }}
                                    >
                                        <Copy size={16} className="mr-1" /> Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExportConfig()}
                                    >
                                        <Download size={16} className="mr-1" /> Export
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsImportModalOpen(true)}
                                    >
                                        <Upload size={16} className="mr-1" /> Import
                                    </Button>
                                </div>
                            </div>
                            <Input
                                className="mb-4"
                                placeholder="Search JSON Structure..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                            />
                            <div className="border border-gray-700 rounded-lg p-4 max-h-96 overflow-auto bg-gray-700 bg-opacity-50">
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
                    )}

                    {/* Routine Editor */}
                    {activeRoutine && (
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                            <h2 className="text-2xl font-semibold mb-4">Routine Editor</h2>
                            <div className="space-y-4">
                                <Input
                                    value={activeRoutine.name}
                                    onChange={(e) =>
                                        updateRoutine(activeRoutine.id, { name: e.target.value })
                                    }
                                    placeholder="Routine Name"
                                />
                                <h3 className="text-xl font-semibold mb-2">
                                    Payloads in Routine
                                </h3>
                                {activeRoutine.payloads.length === 0 ? (
                                    <p className="text-gray-400">
                                        No payloads added to this routine.
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {activeRoutine.payloads.map((payloadId) => {
                                            const payload = payloads.find((p) => p.id === payloadId);
                                            return payload ? (
                                                <li
                                                    key={payloadId}
                                                    className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-2 rounded"
                                                >
                                                    <span>{payload.name}</span>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            removePayloadFromRoutine(
                                                                activeRoutine.id,
                                                                payloadId
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                )}
                                <div className="mt-4">
                                    <select
                                        onChange={(e) => {
                                            const selectedPayloadId = e.target.value;
                                            if (selectedPayloadId !== "")
                                            {
                                                addPayloadToRoutine(
                                                    activeRoutine.id,
                                                    selectedPayloadId
                                                );
                                                e.target.value = "";
                                            }
                                        }}
                                        className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Add payload to routine
                                        </option>
                                        {payloads.map((payload) => (
                                            <option key={payload.id} value={payload.id}>
                                                {payload.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={isAsyncExecution}
                                        onChange={() => setIsAsyncExecution(!isAsyncExecution)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label>Asynchronous Execution</label>
                                </div>
                                <div className="flex space-x-2">
                                    <Button onClick={() => executeRoutine(activeRoutine)}>
                                        <Play size={16} className="mr-1" /> Execute Routine
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => deleteRoutine(activeRoutine.id)}
                                    >
                                        <Trash2 size={16} className="mr-1" /> Delete Routine
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Config Editor */}
                    {activeConfig && (
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                            <h2 className="text-2xl font-semibold mb-4">Config Editor</h2>
                            <div className="space-y-4">
                                <Input
                                    value={activeConfig.name}
                                    onChange={(e) =>
                                        updateConfig(activeConfig.id, { name: e.target.value })
                                    }
                                    placeholder="Config Name"
                                />
                                <h3 className="text-xl font-semibold mb-2">
                                    Routines in Config
                                </h3>
                                {activeConfig.routines.length === 0 ? (
                                    <p className="text-gray-400">
                                        No routines added to this config.
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {activeConfig.routines.map((routineId) => {
                                            const routine = routines.find((r) => r.id === routineId);
                                            return routine ? (
                                                <li
                                                    key={routineId}
                                                    className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-2 rounded"
                                                >
                                                    <span>{routine.name}</span>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            const updatedRoutines =
                                                                activeConfig.routines.filter(
                                                                    (id) => id !== routineId
                                                                );
                                                            updateConfig(activeConfig.id, {
                                                                routines: updatedRoutines,
                                                            });
                                                        }}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                )}
                                <div className="mt-4">
                                    <select
                                        onChange={(e) => {
                                            const selectedRoutineId = e.target.value;
                                            if (selectedRoutineId !== "")
                                            {
                                                const updatedRoutines = [
                                                    ...activeConfig.routines,
                                                    selectedRoutineId,
                                                ];
                                                updateConfig(activeConfig.id, {
                                                    routines: updatedRoutines,
                                                });
                                                e.target.value = "";
                                            }
                                        }}
                                        className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Add routine to config
                                        </option>
                                        {routines.map((routine) => (
                                            <option key={routine.id} value={routine.id}>
                                                {routine.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => {
                                            toast.loading("Executing config...", {
                                                id: "executeConfig",
                                            });
                                            activeConfig.routines.forEach(async (routineId) => {
                                                console.log(routineId);
                                                const routine = routines.find(
                                                    (r) => r.id === routineId
                                                );
                                                if (routine)
                                                {
                                                    await executeRoutine(routine);
                                                }
                                            });
                                            toast.success("Config executed successfully!", {
                                                id: "executeConfig",
                                            });
                                        }}
                                    >
                                        <Play size={16} className="mr-1" /> Execute Config
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => deleteConfig(activeConfig.id)}
                                    >
                                        <Trash2 size={16} className="mr-1" /> Delete Config
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Global Variables */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">Global Variables</h2>
                        <div className="space-y-4">
                            {Object.entries(globalVariables).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <Input
                                        value={key}
                                        onChange={(e) => {
                                            const newVariables = { ...globalVariables };
                                            delete newVariables[key];
                                            newVariables[e.target.value] = value;
                                            setGlobalVariables(newVariables);
                                        }}
                                        placeholder="Variable Name"
                                        className="w-1/3"
                                    />
                                    <Input
                                        value={value}
                                        onChange={(e) => {
                                            setGlobalVariables({
                                                ...globalVariables,
                                                [key]: e.target.value,
                                            });
                                        }}
                                        placeholder="Variable Value"
                                        className="w-1/3"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            const newVariables = { ...globalVariables };
                                            delete newVariables[key];
                                            setGlobalVariables(newVariables);
                                        }}
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={newVarName}
                                    onChange={(e) => setNewVarName(e.target.value)}
                                    placeholder="New Variable Name"
                                    className="w-1/3"
                                />
                                <Input
                                    value={newVarValue}
                                    onChange={(e) => setNewVarValue(e.target.value)}
                                    placeholder="New Variable Value"
                                    className="w-1/3"
                                />
                                <Button
                                    onClick={() => {
                                        if (newVarName && newVarValue)
                                        {
                                            setGlobalVariables({
                                                ...globalVariables,
                                                [newVarName]: newVarValue,
                                            });
                                            setNewVarName("");
                                            setNewVarValue("");
                                        }
                                    }}
                                >
                                    <Plus size={16} className="mr-1" /> Add Variable
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="w-full md:w-1/4">
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">Results</h2>
                        <div className="space-y-4 max-h-96 overflow-auto">
                            {Object.entries(results).map(([id, result]) => (
                                <div key={id} className="bg-gray-700 bg-opacity-50 p-4 rounded">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {result.payload.name}
                                    </h3>
                                    <p className="text-sm text-gray-300 mb-2">
                                        URL: {result.url}
                                    </p>
                                    <JSONViewer json={result.response} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Import Configuration
                        </h2>
                        <TextArea
                            value={importedConfig}
                            onChange={(e) => setImportedConfig(e.target.value)}
                            placeholder="Paste your configuration JSON here"
                            rows={10}
                            className="mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsImportModalOpen(false)}
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

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\PayloadMakerUI2.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\promptHelper.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/promptHelper.jsx

"use client";

import React, { useState } from "@/components/mainDashboardComponents/Button";
import { Plus, Trash } from "lucide-react";

const PromptHelper = () => {
    const [prompts, setPrompts] = useState([
        { id: 1, title: "Generate Blog Post", content: "Write a blog post about the benefits of AI in healthcare." },
        { id: 2, title: "Summarize Document", content: "Summarize the attached project proposal." },
    ]);

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const addPrompt = () => {
        if (newTitle.trim() === "" || newContent.trim() === "") return;
        const newId = prompts.length ? prompts[prompts.length - 1].id + 1 : 1;
        const newPrompt = { id: newId, title: newTitle, content: newContent };
        setPrompts([...prompts, newPrompt]);
        setNewTitle("");
        setNewContent("");
    };

    const removePrompt = (id) => {
        setPrompts(prompts.filter((prompt) => prompt.id !== id));
    };

    const copyPrompt = (content) => {
        navigator.clipboard.writeText(content);
        alert("Prompt copied to clipboard!");
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Prompt Helper</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New Prompt</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Prompt Title</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., Generate Blog Post"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Prompt Content</label>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={4}
                            placeholder="e.g., Write a blog post about the benefits of AI in healthcare."
                        ></textarea>
                    </div>
                    <Button variant="primary" onClick={addPrompt} className="w-full">
                        <Plus size={16} className="mr-2" />
                        Add Prompt
                    </Button>
                </form>
            </div>

            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Saved Prompts</h3>
                <ul className="space-y-4">
                    {prompts.map((prompt) => (
                        <li key={prompt.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-semibold">{prompt.title}</h4>
                                    <p className="text-sm text-gray-400">{prompt.content}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="text-green-500 hover:text-green-700"
                                        onClick={() => copyPrompt(prompt.content)}
                                    >
                                        Copy
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removePrompt(prompt.id)}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PromptHelper;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\promptHelper.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\SettingsView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/SettingsView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const SettingsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue="john.doe@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-md bg-gray-700"
                            defaultValue="Senior Developer"
                            readOnly
                        />
                    </div>
                    <Button variant="primary" className="w-full">
                        Update Profile
                    </Button>
                </form>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <Button variant="primary" className="w-full">
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    </div>
);

export default SettingsView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\SettingsView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\TaskManagementView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/AIWorkflowsView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const AIWorkflowsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AI Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Workflows */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Active Workflows</h3>
                <ul className="space-y-2">
                    {[
                        "Code Review Assistant",
                        "Bug Prediction Model",
                        "Automated Testing Pipeline",
                        "Performance Optimization Analyzer",
                    ].map((workflow, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <span>{workflow}</span>
                            <span className="px-2 py-1 bg-green-500 rounded-full text-xs">Active</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Create New Workflow */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Workflow name"
                        className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Select AI Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <Button variant="primary" className="w-full">
                        Create Workflow
                    </Button>
                </form>
            </div>
        </div>
    </div>
);

export default AIWorkflowsView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\TaskManagementView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\taskManagerAdmin.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/taskManagerAdmin.jsx

"use client";

import React, { useState } from "@/components/mainDashboardComponents/Button";
import { Plus, Trash, Edit } from "lucide-react";

const TaskManagerAdmin = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Implement authentication", assignedTo: "John Doe", status: "In Progress" },
        { id: 2, title: "Design landing page", assignedTo: "Jane Smith", status: "Completed" },
        { id: 3, title: "Set up CI/CD pipeline", assignedTo: "Bob Johnson", status: "Pending" },
    ]);

    const addTask = () => {
        const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
        const newTask = {
            id: newId,
            title: "New Task",
            assignedTo: "Unassigned",
            status: "Pending",
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((task) => task.id === id);
        if (!taskToEdit) return;

        const newTitle = prompt("Enter new task title:", taskToEdit.title);
        const newAssignedTo = prompt("Assign to:", taskToEdit.assignedTo);
        const newStatus = prompt("Enter status (Pending/In Progress/Completed):", taskToEdit.status);

        if (newTitle && newAssignedTo && newStatus)
        {
            setTasks(
                tasks.map((task) =>
                    task.id === id
                        ? { ...task, title: newTitle, assignedTo: newAssignedTo, status: newStatus }
                        : task
                )
            );
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Task Manager Admin</h2>
            <div className="flex justify-end">
                <Button variant="secondary" onClick={addTask} className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Task
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-xl shadow-lg">
                    <thead>
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Assigned To</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-t border-gray-700">
                                <td className="p-3">{task.id}</td>
                                <td className="p-3">{task.title}</td>
                                <td className="p-3">{task.assignedTo}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${task.status === "Completed"
                                            ? "bg-green-500"
                                            : task.status === "In Progress"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </td>
                                <td className="p-3 flex space-x-2">
                                    <button
                                        className="text-yellow-500 hover:text-yellow-700"
                                        onClick={() => editTask(task.id)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeTask(task.id)}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskManagerAdmin;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\taskManagerAdmin.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\taskManagerGanttChart.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/taskManagerGanttChart.jsx

"use client";

import React, { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { format } from "date-fns";

const TaskManagerGanttChart = () => {
    const [tasks, setTasks] = useState([
        {
            start: new Date(2023, 5, 1),
            end: new Date(2023, 5, 5),
            name: "Task 1: Design",
            id: "Task 1",
            progress: 100,
            dependencies: [],
            type: "task",
        },
        {
            start: new Date(2023, 5, 6),
            end: new Date(2023, 5, 10),
            name: "Task 2: Development",
            id: "Task 2",
            progress: 50,
            dependencies: ["Task 1"],
            type: "task",
        },
        {
            start: new Date(2023, 5, 11),
            end: new Date(2023, 5, 15),
            name: "Task 3: Testing",
            id: "Task 3",
            progress: 0,
            dependencies: ["Task 2"],
            type: "task",
        },
        {
            start: new Date(2023, 5, 16),
            end: new Date(2023, 5, 20),
            name: "Task 4: Deployment",
            id: "Task 4",
            progress: 0,
            dependencies: ["Task 3"],
            type: "task",
        },
    ]);

    const handleTaskChange = (task) => {
        const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(updatedTasks);
    };

    const handleTaskDelete = (task) => {
        setTasks(tasks.filter((t) => t.id !== task.id));
    };

    const handleDblClick = (task) => {
        const newName = prompt("Edit Task Name:", task.name);
        if (newName)
        {
            const updatedTask = { ...task, name: newName };
            handleTaskChange(updatedTask);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Task Manager Gantt Chart</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <Gantt
                    tasks={tasks}
                    viewMode={ViewMode.Day}
                    locale="en-GB"
                    onDateChange={(task) => handleTaskChange(task)}
                    onDelete={handleTaskDelete}
                    onDoubleClick={handleDblClick}
                    listCellWidth="155px"
                    columnWidth={65}
                />
            </div>
        </div>
    );
};

export default TaskManagerGanttChart;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\taskManagerGanttChart.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\TeamCollaborationView.jsx`

#### File Content:
```jsx
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

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\TeamCollaborationView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `views\WorkflowBuilderView.jsx`

#### File Content:
```jsx
// frontend/src/components/mainDashboardComponents/views/WorkflowBuilderView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const WorkflowBuilderView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Workflow Builder</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Workflow Name"
                    className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Select Workflow Type</option>
                    <option>Code Review</option>
                    <option>Continuous Integration</option>
                    <option>Deployment</option>
                    <option>Custom</option>
                </select>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 min-h-[200px]">
                    {/* Placeholder for drag-and-drop workflow builder */}
                    <p className="text-center text-gray-400">Drag and drop workflow components here</p>
                </div>
                <Button variant="primary" className="w-full">
                    Save Workflow
                </Button>
            </form>
        </div>
    </div>
);

export default WorkflowBuilderView;

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions/classes for the file '..\..\..\components\mainDashboardComponents\views\WorkflowBuilderView.jsx':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

