"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    User, Bell, Search, Menu, FileText, Zap, Bug, GitBranch,
    Users, Briefcase, Settings, MessageSquare, Disc, ExternalLink,
    ChevronDown, ChevronUp, Code, Plus, Trash2, Play, Copy
} from 'lucide-react';
import { Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast, Toaster } from 'react-hot-toast';

// Import your PayloadMakerUI component
import PayloadMakerUI from './payloadMakerUI/page';

// Sample Data for Charts
const taskData = [
    { name: 'Mon', tasks: 12, bugs: 5, workflows: 3 },
    { name: 'Tue', tasks: 19, bugs: 3, workflows: 5 },
    { name: 'Wed', tasks: 15, bugs: 7, workflows: 4 },
    { name: 'Thu', tasks: 22, bugs: 2, workflows: 6 },
    { name: 'Fri', tasks: 18, bugs: 4, workflows: 5 },
    { name: 'Sat', tasks: 10, bugs: 1, workflows: 2 },
    { name: 'Sun', tasks: 8, bugs: 0, workflows: 1 },
];

// Custom UI Components
const Button = ({ onClick, children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseClasses =
        'flex items-center justify-center space-x-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105';

    const variants = {
        primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        secondary: 'bg-gradient-to-r from-green-500 to-teal-500 text-white',
        destructive: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
        success: 'bg-gradient-to-r from-blue-500 to-green-500 text-white',
        ghost: 'bg-transparent text-gray-200 hover:bg-gray-700',
        outline: 'border border-gray-500 text-gray-200 hover:bg-gray-700',
    };

    const sizes = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xs: 'px-1 py-0.5 text-xs',
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

const Input = ({ value, onChange, placeholder, className = '', icon, ...props }) => (
    <div className={`relative ${className}`}>
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pl-${icon ? '10' : '3'} bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500`}
            {...props}
        />
    </div>
);

const TextArea = ({ value, onChange, placeholder, className = '', ...props }) => (
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
        if (e.key === 'Enter')
        {
            onEdit(node.id, 'name', fieldValue);
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
                    <button onClick={() => onToggle(node.id)} className="text-gray-400 hover:text-white focus:outline-none">
                        {node.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                )}
                {isEditing ? (
                    <Input
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        onKeyDown={handleEdit}
                        onBlur={() => {
                            onEdit(node.id, 'name', fieldValue);
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
                    <Button size="xs" variant="ghost" onClick={() => onAdd(node.id)} className="h-6 w-6 p-0">
                        <Plus size={12} />
                    </Button>
                    {node.id !== 'root' && (
                        <Button size="xs" variant="ghost" onClick={() => onDelete(node.id)} className="h-6 w-6 p-0">
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

// Tabs Component
const Tabs = ({ children }) => {
    return <div>{children}</div>;
};

// FeaturProfile Component
const FeaturProfile = () => (
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
                <p className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full inline-block">CTO</p>
            </div>
        </div>
    </div>
);

// View Components
const TaskManagementView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Task Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Task List</h3>
                <ul className="space-y-2">
                    {['Implement user authentication', 'Design new landing page', 'Optimize database queries', 'Write unit tests'].map((task, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600" />
                            <span>{task}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
                <form className="space-y-4">
                    <input type="text" placeholder="Task name" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <textarea placeholder="Task description" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={3}></textarea>
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Add Task</button>
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
                    {['Code Review Assistant', 'Bug Prediction Model', 'Automated Testing Pipeline', 'Performance Optimization Analyzer'].map((workflow, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <span>{workflow}</span>
                            <span className="px-2 py-1 bg-green-500 rounded-full text-xs">Active</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
                <form className="space-y-4">
                    <input type="text" placeholder="Workflow name" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Select AI Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Create Workflow</button>
                </form>
            </div>
        </div>
    </div>
);

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
                        { id: 'BUG-001', description: 'Login page not responsive on mobile', status: 'Open', severity: 'High', assignedTo: 'John Doe' },
                        { id: 'BUG-002', description: 'Database connection timeout', status: 'In Progress', severity: 'Critical', assignedTo: 'Jane Smith' },
                        { id: 'BUG-003', description: 'Incorrect calculation in billing module', status: 'Resolved', severity: 'Medium', assignedTo: 'Bob Johnson' },
                    ].map((bug) => (
                        <tr key={bug.id} className="border-t border-gray-700">
                            <td className="p-3">{bug.id}</td>
                            <td className="p-3">{bug.description}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${bug.status === 'Open' ? 'bg-red-500' :
                                    bug.status === 'In Progress' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}>
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

const ProjectOverviewView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Project Status</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Web App Redesign', progress: 75 },
                        { name: 'API Integration', progress: 40 },
                        { name: 'Mobile App Development', progress: 60 },
                    ].map((project) => (
                        <div key={project.name}>
                            <div className="flex justify-between mb-1">
                                <span>{project.name}</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Team Performance</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={taskData}>
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <YAxis stroke="#8884d8" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
                        <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="bugs" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
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
                        { name: 'John Doe', role: 'Frontend Developer', status: 'Online' },
                        { name: 'Jane Smith', role: 'Backend Developer', status: 'In a meeting' },
                        { name: 'Bob Johnson', role: 'UI/UX Designer', status: 'Offline' },
                        { name: 'Alice Williams', role: 'Project Manager', status: 'Online' },
                    ].map((member, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-sm text-gray-400">{member.role}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Online' ? 'bg-green-500' :
                                member.status === 'In a meeting' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                }`}>
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
                        { action: 'Commented on', item: 'Bug #127', user: 'John Doe', time: '5 minutes ago' },
                        { action: 'Updated', item: 'Project Timeline', user: 'Alice Williams', time: '1 hour ago' },
                        {
                            action: 'Completed', item: 'Code Review', user: 'Jane Smith', time: '3 hours ago'
                        },
                        { action: 'Created', item: 'New Design Mock-up', user: 'Bob Johnson', time: 'Yesterday' },
                    ].map((activity, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{activity.user} {activity.action} {activity.item}</span>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const APIManagementView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">API Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
                <ul className="space-y-4">
                    {[
                        { method: 'GET', endpoint: '/api/users', description: 'Retrieve all users' },
                        { method: 'POST', endpoint: '/api/users', description: 'Create a new user' },
                        { method: 'PUT', endpoint: '/api/users/:id', description: 'Update a user' },
                        { method: 'DELETE', endpoint: '/api/users/:id', description: 'Delete a user' },
                    ].map((api, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{api.endpoint}</p>
                                <p className="text-sm text-gray-400">{api.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${api.method === 'GET' ? 'bg-green-500' :
                                api.method === 'POST' ? 'bg-blue-500' :
                                    api.method === 'PUT' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                }`}>
                                {api.method}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">API Usage</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={taskData}>
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <YAxis stroke="#8884d8" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
                        <Line type="monotone" dataKey="tasks" name="API Calls" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const AnalyticsDashboardView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Users', value: '1,234', increase: true, percentage: '5.3%' },
                { label: 'Active Projects', value: '42', increase: true, percentage: '2.1%' },
                { label: 'Bugs Resolved', value: '89', increase: false, percentage: '1.5%' },
                { label: 'API Calls', value: '1.2M', increase: true, percentage: '12.7%' },
            ].map((stat, index) => (
                <div key={index} className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.increase ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.increase ? '↑' : '↓'} {stat.percentage}
                    </p>
                </div>
            ))}
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={taskData}>
                    <XAxis dataKey="name" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
                    <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="bugs" name="Bugs" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="workflows" name="Workflows" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
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
                        <input type="text" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" defaultValue="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" defaultValue="john.doe@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <input type="text" className="w-full p-2 rounded-md bg-gray-700" defaultValue="Senior Developer" readOnly />
                    </div>
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Update Profile</button>
                </form>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input type="password" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input type="password" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input type="password" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Change Password</button>
                </form>
            </div>
        </div>
    </div>
);

const HomeView = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: 'Tasks Created', value: '5', icon: FileText },
                        { label: 'AI Generations', value: '12', icon: Zap },
                        { label: 'Open Bugs', value: '28', icon: Bug },
                        { label: 'Team Members', value: '85%', icon: Users },
                    ].map((item) => (
                        <div key={item.label} className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center mb-2">
                                <item.icon className="mr-2" size={20} />
                                <h3 className="text-sm text-gray-400">{item.label}</h3>
                            </div>
                            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Workflow Performance</h3>
                    <h4 className="text-sm text-gray-400 mb-4">Performance Metrics in Last 7 Days</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={taskData}>
                            <XAxis dataKey="name" stroke="#ffffff" />
                            <YAxis stroke="#ffffff" />
                            <Tooltip />
                            <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="bugs" stroke="#82ca9d" strokeWidth={2} />
                            <Line type="monotone" dataKey="workflows" stroke="#ffc658" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="space-y-8">
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                    <ul className="space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                        {[
                            'New AI workflow created for optimization',
                            'Bug #127 fixed and deployed to production',
                            'Team meeting scheduled for project kickoff',
                            'New team member onboarded to the platform',
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
                            { label: 'Create New Task', icon: FileText },
                            { label: 'Generate Workflow', icon: Zap },
                            { label: 'Report a Bug', icon: Bug },
                            { label: 'Invite Team Member', icon: Users },
                        ].map((item) => (
                            <button key={item.label} className="flex items-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <item.icon className="mr-3" size={20} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        );

const ChatbotView = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">AI Chatbot</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
                <div className="flex-grow overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                    {[
                        { sender: 'bot', message: 'Hello! How can I assist you today?' },
                        { sender: 'user', message: 'I need help with creating a new workflow.' },
                        { sender: 'bot', message: 'I can guide you through the process of creating a new workflow. What type of workflow are you looking to create?' },
                        { sender: 'user', message: 'I want to create an automated code review workflow.' },
                        { sender: 'bot', message: 'Great choice! An automated code review workflow can significantly improve your development process. Here are the steps to create one:' },
                        { sender: 'bot', message: '1. Go to the AI Workflows section\n2. Click on "Create New Workflow"\n3. Select "Code Review" as the workflow type\n4. Configure the parameters such as programming language, review criteria, and notification settings\n5. Set up the trigger events (e.g., new pull request)\n6. Save and activate the workflow' },
                        { sender: 'user', message: 'Thanks! Can you explain more about the review criteria?' },
                        { sender: 'bot', message: 'The review criteria are the rules and standards that the AI will use to evaluate the code. This can include:' },
                        { sender: 'bot', message: '- Code style and formatting\n- Potential bugs or errors\n- Code complexity and maintainability\n- Security vulnerabilities\n- Performance optimizations\n\nYou can customize these criteria based on your team\'s specific needs and coding standards.' },
                    ].map((chat, index) => (
                        <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3/4 p-3 rounded-lg ${chat.sender === 'user' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                {chat.message.split('\n').map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-grow p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
        );

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
                        <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Upload</button>
                    </form>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
                    <ul className="space-y-2">
                        {[
                            { name: 'project_requirements.pdf', size: '2.5 MB', date: '2023-06-15' },
                            { name: 'design_mockup.psd', size: '15.7 MB', date: '2023-06-14' },
                            { name: 'database_schema.sql', size: '4.2 KB', date: '2023-06-13' },
                            { name: 'api_documentation.md', size: '18.9 KB', date: '2023-06-12' },
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
                    <input type="text" placeholder="Workflow Name" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
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
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Save Workflow</button>
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
                        <input type="text" placeholder="Agent Name" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <textarea placeholder="Agent Description" className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={3}></textarea>
                        <select className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Select Base Model</option>
                            <option>GPT-4</option>
                            <option>DALL-E</option>
                            <option>Custom Model</option>
                        </select>
                        <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Create Agent</button>
                    </form>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">Active AGI Agents</h3>
                    <ul className="space-y-2">
                        {[
                            { name: 'Code Reviewer', type: 'Development', status: 'Active' },
                            { name: 'Data Analyzer', type: 'Analytics', status: 'Training' },
                            { name: 'Customer Support', type: 'Service', status: 'Active' },
                            { name: 'Content Generator', type: 'Marketing', status: 'Inactive' },
                        ].map((agent, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{agent.name}</p>
                                    <p className="text-sm text-gray-400">{agent.type}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${agent.status === 'Active' ? 'bg-green-500' :
                                    agent.status === 'Training' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`}>
                                    {agent.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        );

const KanbanView = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Kanban Board</h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                {[
                    { title: 'To Do', tasks: ['Design Landing Page', 'Setup CI/CD', 'Write Unit Tests'] },
                    { title: 'In Progress', tasks: ['Develop Authentication', 'API Integration'] },
                    { title: 'Review', tasks: ['Code Review for Module X'] },
                    { title: 'Done', tasks: ['Initial Project Setup', 'Deploy to Staging'] },
                ].map((column, index) => (
                    <div key={index} className="flex-shrink-0 w-64 bg-gray-800 bg-opacity-50 p-4 rounded-xl shadow-lg space-y-4">
                        <h3 className="text-xl font-semibold mb-2">{column.title}</h3>
                        <ul className="space-y-2">
                            {column.tasks.map((task, idx) => (
                                <li key={idx} className="bg-gray-700 bg-opacity-50 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                                    {task}
                                </li>
                            ))}
                        </ul>
                        <Button variant="ghost" size="sm" className="w-full">
                            <Plus size={12} className="mr-2" /> Add Task
                        </Button>
                    </div>
                ))}
            </div>
        </div>
        );

const ChatboardView = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Chat Board</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
                <div className="flex-grow overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                    {[
                        { sender: 'user', message: 'Hey team, any updates on the API integration?' },
                        { sender: 'team', message: 'We are currently testing the endpoints and should have results by EOD.' },
                        { sender: 'user', message: 'Great! Let me know if you need any assistance.' },
                        { sender: 'team', message: 'Will do, thanks!' },
                    ].map((chat, index) => (
                        <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3/4 p-3 rounded-lg ${chat.sender === 'user' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                {chat.message.split('\n').map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-grow p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
        );

// Kanban View Component
const KanbanView = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Kanban Board</h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                {[
                    { title: 'To Do', tasks: ['Design Landing Page', 'Setup CI/CD', 'Write Unit Tests'] },
                    { title: 'In Progress', tasks: ['Develop Authentication', 'API Integration'] },
                    { title: 'Review', tasks: ['Code Review for Module X'] },
                    { title: 'Done', tasks: ['Initial Project Setup', 'Deploy to Staging'] },
                ].map((column, index) => (
                    <div key={index} className="flex-shrink-0 w-64 bg-gray-800 bg-opacity-50 p-4 rounded-xl shadow-lg space-y-4">
                        <h3 className="text-xl font-semibold mb-2">{column.title}</h3>
                        <ul className="space-y-2">
                            {column.tasks.map((task, idx) => (
                                <li key={idx} className="bg-gray-700 bg-opacity-50 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                                    {task}
                                </li>
                            ))}
                        </ul>
                        <Button variant="ghost" size="sm" className="w-full">
                            <Plus size={12} className="mr-2" /> Add Task
                        </Button>
                    </div>
                ))}
            </div>
        </div>
        );

// GitHub Integration View
const GitHubIntegrationView = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">GitHub Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">Connected Repositories</h3>
                    <ul className="space-y-2">
                        {[
                            { name: 'frontend-app', status: 'Connected', lastSync: '5 minutes ago' },
                            { name: 'backend-api', status: 'Connected', lastSync: '1 hour ago' },
                            { name: 'mobile-app', status: 'Disconnected', lastSync: 'N/A' },
                            { name: 'data-processing', status: 'Connected', lastSync: '3 days ago' },
                        ].map((repo, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{repo.name}</p>
                                    <p className="text-sm text-gray-400">Last synced: {repo.lastSync}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${repo.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
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
                            { action: 'Opened Pull Request', repo: 'frontend-app', user: 'John Doe', time: '10 minutes ago' },
                            { action: 'Merged Branch', repo: 'backend-api', user: 'Jane Smith', time: '1 hour ago' },
                            { action: 'Pushed Commit', repo: 'data-processing', user: 'Bob Johnson', time: '3 hours ago' },
                            { action: 'Created Issue', repo: 'frontend-app', user: 'Alice Williams', time: 'Yesterday' },
                        ].map((activity, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>{activity.user} {activity.action} in {activity.repo}</span>
                                <span className="text-xs text-gray-400">{activity.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        );

// Integrated Development Environment View
const IDEView = () => (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">Integrated Development Environment</h2>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
                <div className="flex space-x-2 mb-4">
                    <button className="px-4 py-2 bg-gray-700 rounded-t-lg">main.js</button>
                    <button className="px-4 py-2 bg-gray-600 rounded-t-lg">styles.css</button>
                    <button className="px-4 py-2 bg-gray-600 rounded-t-lg">index.html</button>
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
                    <button className="px-4 py-2 bg
