"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  Bell,
  Search,
  Menu,
  FileText,
  Zap,
  Bug,
  GitBranch,
  Users,
  Briefcase,
  Settings,
  MessageSquare,
  Disc,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  ToggleLeft,
  ToggleRight,
  Trello,
} from "lucide-react";
import { Transition } from "@headlessui/react";
// import PayloadMakerUI2 from '@/components/mainDashboardComponents/PayloadMakerUI2'

// import FeatureProfile from '@/components/mainDashboardComponents/FeatureProfile';
// import NavButton from '@/components/mainDashboardComponents/NavButton';
// import Button from '@/components/mainDashboardComponents/Button';
// import HomeView from '@/components/mainDashboardComponents/views/HomeView';
// import TaskManagementView from '@/components/mainDashboardComponents/views/TaskManagementView';
// import AIWorkflowsView from '@/components/mainDashboardComponents/views/AIWorkflowsView';
// import BugTrackerView from '@/components/mainDashboardComponents/views/BugTrackerView';
// import GitHubIntegrationView from '@/components/mainDashboardComponents/views/GitHubIntegrationView';
// import TeamCollaborationView from '@/components/mainDashboardComponents/views/TeamCollaborationView';
// import SettingsView from '@/components/mainDashboardComponents/views/SettingsView';
// import ChatbotView from '@/components/mainDashboardComponents/views/ChatbotView';
// import FileUploadsView from '@/components/mainDashboardComponents/views/FileUploadsView';
// import WorkflowBuilderView from '@/components/mainDashboardComponents/views/WorkflowBuilderView';
// import AGIAgentBuilderView from '@/components/mainDashboardComponents/views/AGIAgentBuilderView';
// import agentSwarm from '@/components/mainDashboardComponents/views/agentSwarm';
// import IDEView from '@/components/mainDashboardComponents/views/IDEView';

import KanbanBoardView from "../../components/KanbanBoard";

import IdeaGeneratorUI from "../../components/chatbotliveV9";

import CosmicNexusOrchestrator from "../../components/agiBuilder";

import BugTracker from "../../components/bugTracker";

// import PayloadMakerUI2 from '@/components/mainDashboardComponents/views/PayloadMakerUI2';
// import apiMaker from '@/components/mainDashboardComponents/views/apiMaker';
// import nodebuilder from '@/components/mainDashboardComponents/views/nodebuilder';
// import promptHelper from '@/components/mainDashboardComponents/views/promptHelper';
// import taskManagerAdmin from '@/components/mainDashboardComponents/views/taskManagerAdmin';
// import taskManagerGanttChart from '@/components/mainDashboardComponents/views/taskManagerGanttChart';#

// Sample Data for Charts
const taskData = [
  { name: "Mon", tasks: 12, bugs: 5, workflows: 3 },
  { name: "Tue", tasks: 19, bugs: 3, workflows: 5 },
  { name: "Wed", tasks: 15, bugs: 7, workflows: 4 },
  { name: "Thu", tasks: 22, bugs: 2, workflows: 6 },
  { name: "Fri", tasks: 18, bugs: 4, workflows: 5 },
  { name: "Sat", tasks: 10, bugs: 1, workflows: 2 },
  { name: "Sun", tasks: 8, bugs: 0, workflows: 1 },
];

// Custom Button Component
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

// Navigation Button Component with Dropdown
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
    if (dropdown) {
      setIsOpen(!isOpen);
    } else {
      onClick();
    }
  };

  return (
    <div className="w-full">
      <button
        className={`w-full p-3 text-left rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-between ${
          isActive
            ? "bg-gradient-to-r from-purple-600 to-pink-600"
            : "bg-gradient-to-r from-purple-500 to-blue-500"
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <Icon className="mr-3" size={20} />
          <span>{children}</span>
        </div>
        {dropdown &&
          (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
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
                className={`w-full p-2 text-left rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out ${
                  isActive === item.value
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

// Feature Profile Component
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

// View Components
const HomeView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
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

const TaskManagementView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">Task Management</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Task List</h3>
        <ul className="space-y-2">
          {[
            "Implement user authentication",
            "Design new landing page",
            "Optimize database queries",
            "Write unit tests",
          ].map((task, index) => (
            <li key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600"
              />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Task name"
            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Task description"
            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          ></textarea>
          <Button variant="primary" className="w-full">
            Add Task
          </Button>
        </form>
      </div>
    </div>
  </div>
);

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
            <li key={index} className="flex items-center justify-between">
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

// const BugTrackerView = () => (
//   <div className="space-y-8">
//     <h2 className="text-3xl font-bold mb-6">Bug Tracker</h2>
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-gray-800 bg-opacity-50 rounded-xl shadow-lg">
//         <thead>
//           <tr>
//             <th className="p-3 text-left">ID</th>
//             <th className="p-3 text-left">Description</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left">Severity</th>
//             <th className="p-3 text-left">Assigned To</th>
//           </tr>
//         </thead>
//         <tbody>
//           {[
//             {
//               id: "BUG-001",
//               description: "Login page not responsive on mobile",
//               status: "Open",
//               severity: "High",
//               assignedTo: "John Doe",
//             },
//             {
//               id: "BUG-002",
//               description: "Database connection timeout",
//               status: "In Progress",
//               severity: "Critical",
//               assignedTo: "Jane Smith",
//             },
//             {
//               id: "BUG-003",
//               description: "Incorrect calculation in billing module",
//               status: "Resolved",
//               severity: "Medium",
//               assignedTo: "Bob Johnson",
//             },
//           ].map((bug) => (
//             <tr key={bug.id} className="border-t border-gray-700">
//               <td className="p-3">{bug.id}</td>
//               <td className="p-3">{bug.description}</td>
//               <td className="p-3">
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs ${
//                     bug.status === "Open"
//                       ? "bg-red-500"
//                       : bug.status === "In Progress"
//                       ? "bg-yellow-500"
//                       : "bg-green-500"
//                   }`}
//                 >
//                   {bug.status}
//                 </span>
//               </td>
//               <td className="p-3">{bug.severity}</td>
//               <td className="p-3">{bug.assignedTo}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

const GitHubIntegrationView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">GitHub Integration</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Connected Repositories</h3>
        <ul className="space-y-2">
          {[
            {
              name: "frontend-app",
              status: "Connected",
              lastSync: "5 minutes ago",
            },
            {
              name: "backend-api",
              status: "Connected",
              lastSync: "1 hour ago",
            },
            { name: "mobile-app", status: "Disconnected", lastSync: "N/A" },
            {
              name: "data-processing",
              status: "Connected",
              lastSync: "3 days ago",
            },
          ].map((repo, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{repo.name}</p>
                <p className="text-sm text-gray-400">
                  Last synced: {repo.lastSync}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  repo.status === "Connected" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {repo.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
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

const TeamCollaborationView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">Team Collaboration</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Team Members</h3>
        <ul className="space-y-4">
          {[
            { name: "John Doe", role: "Frontend Developer", status: "Online" },
            {
              name: "Jane Smith",
              role: "Backend Developer",
              status: "In a meeting",
            },
            { name: "Bob Johnson", role: "UI/UX Designer", status: "Offline" },
            {
              name: "Alice Williams",
              role: "Project Manager",
              status: "Online",
            },
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
                className={`px-2 py-1 rounded-full text-xs ${
                  member.status === "Online"
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
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        <ul className="space-y-4">
          {[
            {
              action: "Commented on",
              item: "Bug #127",
              user: "John Doe",
              time: "5 minutes ago",
            },
            {
              action: "Updated",
              item: "Project Timeline",
              user: "Alice Williams",
              time: "1 hour ago",
            },
            {
              action: "Completed",
              item: "Code Review",
              user: "Jane Smith",
              time: "3 hours ago",
            },
            {
              action: "Created",
              item: "New Design Mock-up",
              user: "Bob Johnson",
              time: "Yesterday",
            },
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

const SettingsView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
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

const PayloadMakerUI2View = () => (
  <div className="h-full overflow-auto">
    <PayloadMakerUI2 />
  </div>
);

// const ChatbotView = () => (
//   <div className="space-y-8">
//     <h2 className="text-3xl font-bold mb-6">AI Chatbot</h2>
//     <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
//       <div className="flex-grow overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
//         {[
//           { sender: "bot", message: "Hello! How can I assist you today?" },
//           {
//             sender: "user",
//             message: "I need help with creating a new workflow.",
//           },
//           {
//             sender: "bot",
//             message:
//               "I can guide you through the process of creating a new workflow. What type of workflow are you looking to create?",
//           },
//           {
//             sender: "user",
//             message: "I want to create an automated code review workflow.",
//           },
//           {
//             sender: "bot",
//             message:
//               "Great choice! An automated code review workflow can significantly improve your development process. Here are the steps to create one:",
//           },
//           {
//             sender: "bot",
//             message:
//               '1. Go to the AI Workflows section\n2. Click on "Create New Workflow"\n3. Select "Code Review" as the workflow type\n4. Configure the parameters such as programming language, review criteria, and notification settings\n5. Set up the trigger events (e.g., new pull request)\n6. Save and activate the workflow',
//           },
//           {
//             sender: "user",
//             message: "Thanks! Can you explain more about the review criteria?",
//           },
//           {
//             sender: "bot",
//             message:
//               "The review criteria are the rules and standards that the AI will use to evaluate the code. This can include:",
//           },
//           {
//             sender: "bot",
//             message:
//               "- Code style and formatting\n- Potential bugs or errors\n- Code complexity and maintainability\n- Security vulnerabilities\n- Performance optimizations\n\nYou can customize these criteria based on your team's specific needs and coding standards.",
//           },
//         ].map((chat, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               chat.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-3/4 p-3 rounded-lg ${
//                 chat.sender === "user" ? "bg-purple-600" : "bg-gray-700"
//               }`}
//             >
//               {chat.message.split("\n").map((line, idx) => (
//                 <span key={idx}>
//                   {line}
//                   <br />
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex space-x-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="flex-grow p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//         <Button variant="primary">Send</Button>
//       </div>
//     </div>
//   </div>
// );

const FileUploadsView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">File Uploads</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
        <ul className="space-y-2">
          {[
            {
              name: "project_requirements.pdf",
              size: "2.5 MB",
              date: "2023-06-15",
            },
            { name: "design_mockup.psd", size: "15.7 MB", date: "2023-06-14" },
            { name: "database_schema.sql", size: "4.2 KB", date: "2023-06-13" },
            {
              name: "api_documentation.md",
              size: "18.9 KB",
              date: "2023-06-12",
            },
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
          <p className="text-center text-gray-400">
            Drag and drop workflow components here
          </p>
        </div>
        <Button variant="primary" className="w-full">
          Save Workflow
        </Button>
      </form>
    </div>
  </div>
);

const AGIAgentBuilderView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">AGI Agent Builder</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Active AGI Agents</h3>
        <ul className="space-y-2">
          {[
            { name: "Code Reviewer", type: "Development", status: "Active" },
            { name: "Data Analyzer", type: "Analytics", status: "Training" },
            { name: "Customer Support", type: "Service", status: "Active" },
            {
              name: "Content Generator",
              type: "Marketing",
              status: "Inactive",
            },
          ].map((agent, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{agent.name}</p>
                <p className="text-sm text-gray-400">{agent.type}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  agent.status === "Active"
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

const IDEView = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold mb-6">
      Integrated Development Environment
    </h2>
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
      <div className="flex space-x-2 mb-4">
        <button className="px-4 py-2 bg-gray-700 rounded-t-lg">main.js</button>
        <button className="px-4 py-2 bg-gray-600 rounded-t-lg">
          styles.css
        </button>
        <button className="px-4 py-2 bg-gray-600 rounded-t-lg">
          index.html
        </button>
      </div>
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
      <div className="mt-4 flex justify-between">
        <Button variant="primary">Run</Button>
        <Button variant="success">Save</Button>
      </div>
    </div>
  </div>
);

// const KanbanBoardView = () => {
//   const [tasks, setTasks] = useState({
//     todo: [
//       { id: 1, title: "Design new landing page" },
//       { id: 2, title: "Implement user authentication" },
//     ],
//     inProgress: [
//       { id: 3, title: "Optimize database queries" },
//       { id: 4, title: "Create API documentation" },
//     ],
//     done: [
//       { id: 5, title: "Set up CI/CD pipeline" },
//       { id: 6, title: "Write unit tests for core modules" },
//     ],
//   });

//   const onDragStart = (e, id) => {
//     e.dataTransfer.setData("text/plain", id);
//   };

//   const onDragOver = (e) => {
//     e.preventDefault();
//   };

//   const onDrop = (e, category) => {
//     const id = e.dataTransfer.getData("text");
//     const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
//     const task = allTasks.find((task) => task.id === parseInt(id));

//     const newTasks = {
//       todo: tasks.todo.filter((task) => task.id !== parseInt(id)),
//       inProgress: tasks.inProgress.filter((task) => task.id !== parseInt(id)),
//       done: tasks.done.filter((task) => task.id !== parseInt(id)),
//     };

//     newTasks[category] = [...newTasks[category], task];
//     setTasks(newTasks);
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-3xl font-bold mb-6">Kanban Board</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {Object.keys(tasks).map((category) => (
//           <div
//             key={category}
//             className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg"
//             onDragOver={onDragOver}
//             onDrop={(e) => onDrop(e, category)}
//           >
//             <h3 className="text-xl font-semibold mb-4 capitalize">
//               {category}
//             </h3>
//             <ul className="space-y-2">
//               {tasks[category].map((task) => (
//                 <li
//                   key={task.id}
//                   className="bg-gray-700 p-3 rounded-lg cursor-move"
//                   draggable
//                   onDragStart={(e) => onDragStart(e, task.id)}
//                 >
//                   {task.title}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
export default function Dashboard() {
  const [activeView, setActiveView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "tasks":
        return <TaskManagementView />;
      case "aiWorkflows":
        return <AIWorkflowsView />;
      case "bugTracker":
        return <BugTracker />;
      case "githubIntegration":
        return <GitHubIntegrationView />;
      case "teamCollaboration":
        return <TeamCollaborationView />;
      case "PayloadMakerUI2":
        return <PayloadMakerUI2 />;
      case "settings":
        return <SettingsView />;
      case "home":
        return <HomeView />;
      case "chatbot":
        return <IdeaGeneratorUI />;
      case "fileUploads":
        return <FileUploadsView />;
      case "workflowBuilder":
        return <WorkflowBuilderView />;
      case "agiAgentBuilder":
        return <AGIAgentBuilderView />;
      case "ide":
        return <IDEView />;
      case "kanban":
        return <KanbanBoardView />;
      default:
        return <HomeView />;
    }
  };

  const TaskManagementView = () => (
    <div>
      <h2>Task Management</h2>
      {/* Add task management components here */}
    </div>
  );

  const AIWorkflowsView = () => (
    <div>
      <h2>AI Workflows</h2>
      {/* Add AI workflows components here */}
      <CosmicNexusOrchestrator />
    </div>
  );

  const BugTrackerView = () => (
    <div>
      <h2>Bug Tracker</h2>
      {/* Add bug tracker components here */}
    </div>
  );

  const GitHubIntegrationView = () => (
    <div>
      <h2>GitHub Integration</h2>
      {/* Add GitHub integration components here */}
    </div>
  );

  //tco
  //   const TeamCollaborationView = () => (
  //     <div>
  //       <h2>Team Collaboration</h2>
  //       {/* Add team collaboration components here */}
  //     </div>
  //   );

  const SettingsView = () => (
    <div>
      <h2>Settings</h2>
      {/* Add settings components here */}
    </div>
  );

  const ChatbotView = () => (
    <div>
      <h2>Chatbot</h2>
      {/* Add chatbot components here */}
      <IdeaGeneratorUI />
    </div>
  );

  const FileUploadsView = () => (
    <div>
      <h2>File Uploads</h2>
      {/* Add file upload components here */}
    </div>
  );

  const WorkflowBuilderView = () => (
    <div>
      <h2>Workflow Builder</h2>
      {/* Add workflow builder components here */}
    </div>
  );

  const AGIAgentBuilderView = () => (
    <div>
      <h2>AGI Agent Builder</h2>
      {/* Add AGI agent builder components here */}
    </div>
  );

  const IDEView = () => (
    <div>
      <h2>IDE</h2>
      {/* Add IDE components here */}
    </div>
  );

  const toggleAIMode = () => {
    setIsAIMode(!isAIMode);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen font-sans">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-gray-800 bg-opacity-50 p-4 backdrop-filter backdrop-blur-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
              GROQY AI
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 bg-gray-700 bg-opacity-50 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <Bell className="text-gray-400 cursor-pointer" />
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow flex overflow-hidden">
          {/* Sidebar */}
          <nav className="hidden md:flex flex-col w-64 bg-gray-800 bg-opacity-50 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
            <FeatureProfile />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">AI Mode</span>
              <button
                onClick={toggleAIMode}
                className={`p-1 rounded-full transition-colors duration-200 ease-in-out ${
                  isAIMode ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                {isAIMode ? (
                  <ToggleRight className="w-6 h-6 text-white" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
            <NavButton
              icon={Briefcase}
              onClick={() => setActiveView("home")}
              isActive={activeView === "home"}
            >
              Dashboard
            </NavButton>
            <NavButton
              icon={FileText}
              onClick={() => setActiveView("tasks")}
              isActive={activeView === "tasks"}
            >
              Tasks
            </NavButton>
            <NavButton
              icon={Zap}
              onClick={() => setActiveView("aiWorkflows")}
              isActive={activeView === "aiWorkflows"}
            >
              AI Workflows
            </NavButton>
            <NavButton
              icon={Bug}
              onClick={() => setActiveView("bugTracker")}
              isActive={activeView === "bugTracker"}
            >
              Bug Tracker
            </NavButton>
            <NavButton
              icon={GitBranch}
              onClick={() => setActiveView("githubIntegration")}
              isActive={activeView === "githubIntegration"}
            >
              GitHub Integration
            </NavButton>
            <NavButton
              icon={Users}
              onClick={() => setActiveView("teamCollaboration")}
              isActive={activeView === "teamCollaboration"}
            >
              Team Collaboration
            </NavButton>
            <NavButton
              icon={Trello}
              onClick={() => setActiveView("kanban")}
              isActive={activeView === "kanban"}
            >
              Kanban Board
            </NavButton>
            {isAIMode && (
              <>
                <NavButton
                  icon={MessageSquare}
                  onClick={() => setActiveView("chatbot")}
                  isActive={activeView === "chatbot"}
                >
                  Chatbot
                </NavButton>
                <NavButton
                  icon={Disc}
                  onClick={() => setActiveView("workflowBuilder")}
                  isActive={activeView === "workflowBuilder"}
                >
                  Workflow Builder
                </NavButton>
                <NavButton
                  icon={Zap}
                  onClick={() => setActiveView("agiAgentBuilder")}
                  isActive={activeView === "agiAgentBuilder"}
                >
                  AGI Agent Builder
                </NavButton>
                <NavButton
                  icon={Code}
                  onClick={() => setActiveView("ide")}
                  isActive={activeView === "ide"}
                >
                  IDE
                </NavButton>
              </>
            )}
            <NavButton
              icon={Settings}
              onClick={() => setActiveView("settings")}
              isActive={activeView === "settings"}
            >
              Settings
            </NavButton>
          </nav>

          {/* Content Area */}
          <main className="flex-grow p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
            <div className="bg-gray-800 bg-opacity-50 rounded-3xl shadow-lg p-6">
              {renderView()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
          <div className="flex space-x-4">
            <NavButton
              icon={Briefcase}
              onClick={() => setActiveView("home")}
              isActive={activeView === "home"}
            >
              Home
            </NavButton>
            <NavButton
              icon={FileText}
              onClick={() => setActiveView("tasks")}
              isActive={activeView === "tasks"}
            >
              Tasks
            </NavButton>
            <NavButton
              icon={Zap}
              onClick={() => setActiveView("aiWorkflows")}
              isActive={activeView === "aiWorkflows"}
            >
              AI
            </NavButton>
            <NavButton
              icon={Bug}
              onClick={() => setActiveView("bugTracker")}
              isActive={activeView === "bugTracker"}
            >
              Bugs
            </NavButton>
            <NavButton
              icon={GitBranch}
              onClick={() => setActiveView("githubIntegration")}
              isActive={activeView === "githubIntegration"}
            >
              GitHub
            </NavButton>
            <NavButton
              icon={Users}
              onClick={() => setActiveView("teamCollaboration")}
              isActive={activeView === "teamCollaboration"}
            >
              Team
            </NavButton>
            {isAIMode && (
              <>
                <NavButton
                  icon={MessageSquare}
                  onClick={() => setActiveView("chatbot")}
                  isActive={activeView === "chatbot"}
                >
                  Chat
                </NavButton>
                <NavButton
                  icon={Code}
                  onClick={() => setActiveView("ide")}
                  isActive={activeView === "ide"}
                >
                  IDE
                </NavButton>
              </>
            )}
            <NavButton
              icon={Settings}
              onClick={() => setActiveView("settings")}
              isActive={activeView === "settings"}
            >
              Settings
            </NavButton>
          </div>
        </nav>
      </div>
    </div>
  );
}
