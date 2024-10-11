// frontend/src/components/mainDashboardComponents/views/GitHubIntegrationView.jsx
"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  Play,
  Pause,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Copy,
  Save,
  AlertCircle,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Github,
  Search,
  Settings,
  Users,
} from "lucide-react";

export default function GroqyDashboard() {
  const [activeTab, setActiveTab] = useState("agents");
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Content Generator",
      status: "active",
      type: "AI",
      tasks: 45,
      successRate: 92,
    },
    {
      id: 2,
      name: "Data Analyzer",
      status: "idle",
      type: "AI",
      tasks: 30,
      successRate: 88,
    },
    {
      id: 3,
      name: "Customer Support",
      status: "training",
      type: "Human-AI Hybrid",
      tasks: 100,
      successRate: 95,
    },
  ]);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showTaskAutomation, setShowTaskAutomation] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentType, setNewAgentType] = useState("AI");
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  const [automationTasks, setAutomationTasks] = useState([
    {
      id: 1,
      name: "Generate Product Descriptions",
      status: "running",
      completedTasks: 23,
      totalTasks: 50,
    },
    {
      id: 2,
      name: "Analyze Customer Feedback",
      status: "paused",
      completedTasks: 75,
      totalTasks: 100,
    },
  ]);
  const [cloneUrl, setCloneUrl] = useState("");
  const [repositories, setRepositories] = useState([
    { name: "frontend-app", status: "Connected", lastSync: "5 minutes ago" },
    { name: "backend-api", status: "Connected", lastSync: "1 hour ago" },
    { name: "mobile-app", status: "Disconnected", lastSync: "N/A" },
    { name: "data-processing", status: "Connected", lastSync: "3 days ago" },
  ]);
  const [activities] = useState([
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
  ]);

  const handleCreateAgent = () => {
    const newAgent = {
      id: agents.length + 1,
      name: newAgentName,
      status: "idle",
      type: newAgentType,
      tasks: 0,
      successRate: 0,
    };
    setAgents([...agents, newAgent]);
    setShowCreateAgent(false);
    setNewAgentName("");
    setNewAgentType("AI");
    setNewAgentPrompt("");
  };

  const handleDeleteAgent = (id) => {
    setAgents(agents.filter((agent) => agent.id !== id));
  };

  const handleStartAutomation = (taskId) => {
    setAutomationTasks(
      automationTasks.map((task) =>
        task.id === taskId ? { ...task, status: "running" } : task
      )
    );
  };

  const handlePauseAutomation = (taskId) => {
    setAutomationTasks(
      automationTasks.map((task) =>
        task.id === taskId ? { ...task, status: "paused" } : task
      )
    );
  };

  const handleCloneRepo = (e) => {
    e.preventDefault();
    setRepositories([
      ...repositories,
      {
        name: cloneUrl.split("/").pop().replace(".git", ""),
        status: "Cloning",
        lastSync: "Just now",
      },
    ]);
    setCloneUrl("");
  };

  const renderAgentManager = () => (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Agents</h2>
          <button
            onClick={() => setShowCreateAgent(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Plus size={20} className="mr-2" /> Create Agent
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-600">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Tasks Completed</th>
                <th className="px-4 py-2 text-left">Success Rate</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-gray-600">
                  <td className="px-4 py-2">{agent.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        agent.status === "active"
                          ? "bg-green-500"
                          : agent.status === "idle"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{agent.type}</td>
                  <td className="px-4 py-2">{agent.tasks}</td>
                  <td className="px-4 py-2">{agent.successRate}%</td>
                  <td className="px-4 py-2">
                    <button className="text-blue-400 hover:text-blue-300 mr-2">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Task Automation</h2>
          <button
            onClick={() => setShowTaskAutomation(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Plus size={20} className="mr-2" /> New Automation
          </button>
        </div>
        <div className="space-y-4">
          {automationTasks.map((task) => (
            <div key={task.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{task.name}</h3>
                <div className="space-x-2">
                  {task.status === "running" ? (
                    <button
                      onClick={() => handlePauseAutomation(task.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                      <Pause size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartAutomation(task.id)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                    >
                      <Play size={18} />
                    </button>
                  )}
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
                    <Edit size={18} />
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-600 rounded-full h-2.5 mr-4">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (task.completedTasks / task.totalTasks) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span>
                  {task.completedTasks} / {task.totalTasks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGitHubIntegration = () => (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Clone Repository</h3>
        <form onSubmit={handleCloneRepo} className="flex space-x-4">
          <input
            type="text"
            value={cloneUrl}
            onChange={(e) => setCloneUrl(e.target.value)}
            placeholder="Enter GitHub repository URL"
            className="flex-grow px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Clone</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Connected Repositories</h3>
          <ul className="space-y-2">
            {repositories.map((repo, index) => (
              <li key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{repo.name}</p>
                  <p className="text-sm text-gray-400">
                    Last synced: {repo.lastSync}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    repo.status === "Connected"
                      ? "bg-green-500"
                      : repo.status === "Cloning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {repo.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <ul className="space-y-4">
            {activities.map((activity, index) => (
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

      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Pull Requests</h3>
        <ul className="space-y-4">
          {[
            {
              title: "Update README.md",
              repo: "frontend-app",
              author: "John Doe",
              status: "Open",
            },
            {
              title: "Fix login bug",
              repo: "backend-api",
              author: "Jane Smith",
              status: "Merged",
            },
            {
              title: "Add new feature",
              repo: "mobile-app",
              author: "Bob Johnson",
              status: "Draft",
            },
          ].map((pr, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{pr.title}</p>
                <p className="text-sm text-gray-400">
                  {pr.repo} • by {pr.author}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  pr.status === "Open"
                    ? "bg-green-500"
                    : pr.status === "Merged"
                    ? "bg-purple-500"
                    : "bg-yellow-500"
                }`}
              >
                {pr.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Groqy Dashboard</h1>
        <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      <div className="flex space-x-4 border-b border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab("agents")}
          className={`px-4 py-2  font-semibold ${
            activeTab === "agents"
              ? "text-purple-500 border-b-2 border-purple-500"
              : "text-gray-400"
          }`}
        >
          Agents & Automation
        </button>
        <button
          onClick={() => setActiveTab("github")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "github"
              ? "text-purple-500 border-b-2 border-purple-500"
              : "text-gray-400"
          }`}
        >
          GitHub Integration
        </button>
      </div>

      {activeTab === "agents"
        ? renderAgentManager()
        : renderGitHubIntegration()}

      {showCreateAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create New Agent</h2>
              <button
                onClick={() => setShowCreateAgent(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Agent Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <label className="block mb-2">Agent Type</label>
                <select
                  value={newAgentType}
                  onChange={(e) => setNewAgentType(e.target.value)}
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="AI">AI</option>
                  <option value="Human-AI Hybrid">Human-AI Hybrid</option>
                  <option value="Rule-based">Rule-based</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Initial Prompt</label>
                <textarea
                  value={newAgentPrompt}
                  onChange={(e) => setNewAgentPrompt(e.target.value)}
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  placeholder="Enter initial prompt for the agent"
                ></textarea>
              </div>
              <button
                onClick={handleCreateAgent}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskAutomation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Create New Task Automation
              </h2>
              <button
                onClick={() => setShowTaskAutomation(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Task Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block mb-2">Select Agent</label>
                <select className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Task Prompt</label>
                <textarea
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                  placeholder="Enter the prompt for this task"
                ></textarea>
              </div>
              <div>
                <label className="block mb-2">Input Data (CSV or JSON)</label>
                <input
                  type="file"
                  className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="repeat" className="mr-2" />
                <label htmlFor="repeat">Repeat task</label>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Create Task Automation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 flex space-x-4">
        <button className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
          <RefreshCw size={24} />
        </button>
        <button className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors">
          <Github size={24} />
        </button>
      </div>
    </div>
  );
}
