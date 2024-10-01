"use client";
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    User, Bell, Search, Menu, FileText, Zap, Bug, GitBranch,
    Users, Briefcase, Settings, MessageSquare, Disc, ExternalLink,
    ChevronDown, ChevronUp, Code
} from 'lucide-react';
import { Transition } from '@headlessui/react';

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

// Navigation Button Component with Dropdown
const NavButton = ({ children, icon: Icon, onClick, isActive, dropdown, dropdownItems }) => {
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
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
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
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                    : 'bg-gradient-to-r from-purple-400 to-blue-400'
                                    }`}
                                onClick={() => { item.onClick(); setIsOpen(false); }}
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

// View Components
const TaskManagementView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Task Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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
                    <input type="text" placeholder="Task name" className="w-full p-2 rounded-md bg-gray-700" />
                    <textarea placeholder="Task description" className="w-full p-2 rounded-md bg-gray-700" rows={3}></textarea>
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
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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
                    <input type="text" placeholder="Workflow name" className="w-full p-2 rounded-md bg-gray-700" />
                    <select className="w-full p-2 rounded-md bg-gray-700">
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
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Team Members</h3>
                <ul className="space-y-4">
                    {[
                        { name: 'John Doe', role: 'Frontend Developer', status: 'Online' },
                        { name: 'Jane Smith', role: 'Backend Developer', status: 'In a meeting' },
                        { name: 'Bob Johnson', role: 'UI/UX Designer', status: 'Offline' },
                        { name: 'Alice Williams', role: 'Project Manager', status: 'Online' },
                    ].map((member, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
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
                        { action: 'Completed', item: 'Code Review', user: 'Jane Smith', time: '3 hours ago' },
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
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
                <ul className="space-y-4">
                    {[
                        { method: 'GET', endpoint: '/api/users', description: 'Retrieve all users' },
                        { method: 'POST', endpoint: '/api/users', description: 'Create a new user' },
                        { method: 'PUT', endpoint: '/api/users/:id', description: 'Update a user' },
                        { method: 'DELETE', endpoint: '/api/users/:id', description: 'Delete a user' },
                    ].map((api, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${api.method === 'GET' ? 'bg-green-500' :
                                api.method === 'POST' ? 'bg-blue-500' :
                                    api.method === 'PUT' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                }`}>
                                {api.method}
                            </span>
                            <div>
                                <p className="font-semibold">{api.endpoint}</p>
                                <p className="text-sm text-gray-400">{api.description}</p>
                            </div>
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
                <div key={index} className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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
                        <input type="text" className="w-full p-2 rounded-md bg-gray-700" defaultValue="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" className="w-full p-2 rounded-md bg-gray-700" defaultValue="john.doe@example.com" />
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
                        <input type="password" className="w-full p-2 rounded-md bg-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input type="password" className="w-full p-2 rounded-md bg-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input type="password" className="w-full p-2 rounded-md bg-gray-700" />
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
                            <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="bugs" name="Bugs" stroke="#82ca9d" strokeWidth={2} />
                            <Line type="monotone" dataKey="workflows" name="Workflows" stroke="#ffc658" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="space-y-8">
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
                    <ul className="space-y-4">
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
    </div>
);

const ChatbotView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AI Chatbot</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
            <div className="flex-grow overflow-y-auto mb-4 space-y-4">
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
                            {chat.message}
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
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                        <p>Drag and drop files here or click to select</p>
                        <input type="file" className="hidden" />
                    </div>
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Upload</button>
                </form>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
            <form className="space-y-4">
                <input type="text" placeholder="Workflow Name" className="w-full p-2 rounded-md bg-gray-700" />
                <select className="w-full p-2 rounded-md bg-gray-700">
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
                    <input type="text" placeholder="Agent Name" className="w-full p-2 rounded-md bg-gray-700" />
                    <textarea placeholder="Agent Description" className="w-full p-2 rounded-md bg-gray-700" rows={3}></textarea>
                    <select className="w-full p-2 rounded-md bg-gray-700">
                        <option>Select Base Model</option>
                        <option>GPT-4</option>
                        <option>DALL-E</option>
                        <option>Custom Model</option>
                    </select>
                    <button className="w-full p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Create Agent</button>
                </form>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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

const GitHubIntegrationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">GitHub Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
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

const IDEView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Integrated Development Environment</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
            <div className="flex space-x-2 mb-4">
                <button className="px-4 py-2 bg-gray-700 rounded-t-lg">main.js</button>
                <button className="px-4 py-2 bg-gray-600 rounded-t-lg">styles.css</button>
                <button className="px-4 py-2 bg-gray-600 rounded-t-lg">index.html</button>
            </div>
            <div className="flex-grow bg-gray-900 p-4 font-mono text-sm overflow-auto">
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
                <button className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">Run</button>
                <button className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors">Save</button>
            </div>
        </div>
    </div>
);

// Updated Dashboard Component with Optimized Navigation
export default function Dashboard() {
    const [activeView, setActiveView] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);

    const renderView = () => {
        switch (activeView)
        {
            case 'tasks':
                return <TaskManagementView />;
            case 'aiWorkflows':
                return <AIWorkflowsView />;
            case 'bugTracker':
                return <BugTrackerView />;
            case 'projectOverview':
                return <ProjectOverviewView />;
            case 'teamCollaboration':
                return <TeamCollaborationView />;
            case 'apiManagement':
                return <APIManagementView />;
            case 'analyticsDashboard':
                return <AnalyticsDashboardView />;
            case 'settings':
                return <SettingsView />;
            case 'home':
                return <HomeView />;
            case 'apiIntegration':
                return <APIManagementView />;
            case 'chatbot':
                return <ChatbotView />;
            case 'fileUploads':
                return <FileUploadsView />;
            case 'workflowBuilder':
                return <WorkflowBuilderView />;
            case 'agiAgentBuilder':
                return <AGIAgentBuilderView />;
            case 'githubIntegration':
                return <GitHubIntegrationView />;
            case 'ide':
                return <IDEView />;
            default:
                return <HomeView />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen font-sans">
            <div className="flex flex-col h-screen">
                {/* Header */}
                <header className="bg-gray-800 bg-opacity-50 p-4 backdrop-filter backdrop-blur-lg">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">GROQY Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-64 bg-gray-700 bg-opacity-50 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
                    <nav className="hidden md:flex flex-col w-64 bg-gray-800 bg-opacity-50 p-4 space-y-2 overflow-y-auto">
                        <NavButton
                            icon={Briefcase}
                            onClick={() => setActiveView('home')}
                            isActive={activeView === 'home'}
                        >
                            Dashboard
                        </NavButton>
                        <NavButton
                            icon={FileText}
                            onClick={() => setActiveView('tasks')}
                            isActive={activeView === 'tasks'}
                        >
                            Tasks
                        </NavButton>
                        <NavButton
                            icon={Zap}
                            onClick={() => setActiveView('aiWorkflows')}
                            isActive={activeView === 'aiWorkflows'}
                        >
                            AI Workflows
                        </NavButton>
                        <NavButton
                            icon={Bug}
                            onClick={() => setActiveView('bugTracker')}
                            isActive={activeView === 'bugTracker'}
                        >
                            Bug Tracker
                        </NavButton>
                        <NavButton
                            icon={GitBranch}
                            onClick={() => setActiveView('githubIntegration')}
                            isActive={activeView === 'githubIntegration'}
                        >
                            GitHub Integration
                        </NavButton>
                        <NavButton
                            icon={Users}
                            onClick={() => setActiveView('teamCollaboration')}
                            isActive={activeView === 'teamCollaboration'}
                        >
                            Team Collaboration
                        </NavButton>
                        <NavButton
                            icon={MessageSquare}
                            onClick={() => setActiveView('chatbot')}
                            isActive={activeView === 'chatbot'}
                        >
                            Chatbot
                        </NavButton>
                        <NavButton
                            icon={Code}
                            onClick={() => setActiveView('ide')}
                            isActive={activeView === 'ide'}
                        >
                            IDE
                        </NavButton>
                        <NavButton
                            icon={Settings}
                            onClick={() => setActiveView('settings')}
                            isActive={activeView === 'settings'}
                        >
                            Settings
                        </NavButton>
                    </nav>

                    {/* Content Area */}
                    <main className="flex-grow p-6 overflow-y-auto">
                        {renderView()}
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-2 overflow-x-auto whitespace-nowrap">
                    <div className="flex space-x-4">
                        <NavButton
                            icon={Briefcase}
                            onClick={() => setActiveView('home')}
                            isActive={activeView === 'home'}
                        >
                            Home
                        </NavButton>
                        <NavButton
                            icon={FileText}
                            onClick={() => setActiveView('tasks')}
                            isActive={activeView === 'tasks'}
                        >
                            Tasks
                        </NavButton>
                        <NavButton
                            icon={Zap}
                            onClick={() => setActiveView('aiWorkflows')}
                            isActive={activeView === 'aiWorkflows'}
                        >
                            AI
                        </NavButton>
                        <NavButton
                            icon={Bug}
                            onClick={() => setActiveView('bugTracker')}
                            isActive={activeView === 'bugTracker'}
                        >
                            Bugs
                        </NavButton>
                        <NavButton
                            icon={GitBranch}
                            onClick={() => setActiveView('githubIntegration')}
                            isActive={activeView === 'githubIntegration'}
                        >
                            GitHub
                        </NavButton>
                        <NavButton
                            icon={Users}
                            onClick={() => setActiveView('teamCollaboration')}
                            isActive={activeView === 'teamCollaboration'}
                        >
                            Team
                        </NavButton>
                        <NavButton
                            icon={MessageSquare}
                            onClick={() => setActiveView('chatbot')}
                            isActive={activeView === 'chatbot'}
                        >
                            Chat
                        </NavButton>
                        <NavButton
                            icon={Code}
                            onClick={() => setActiveView('ide')}
                            isActive={activeView === 'ide'}
                        >
                            IDE
                        </NavButton>
                        <NavButton
                            icon={Settings}
                            onClick={() => setActiveView('settings')}
                            isActive={activeView === 'settings'}
                        >
                            Settings
                        </NavButton>
                    </div>
                </nav>
            </div>
        </div>
    );
}