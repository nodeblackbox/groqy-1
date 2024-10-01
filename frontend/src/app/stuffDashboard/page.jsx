"use client";
import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    User, Bell, Search, Menu, FileText, Zap, Bug, GitBranch,
    Users, Briefcase, Settings, MessageSquare, Disc, ExternalLink,
    ChevronDown, ChevronUp, Chat
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

const profileViewData = [
    { name: '1', value: 10 },
    { name: '2', value: 30 },
    { name: '3', value: 15 },
    { name: '4', value: 40 },
    { name: '5', value: 20 },
    { name: '6', value: 35 },
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
        <p>Manage tasks: Create, assign, track, and visualize tasks with advanced filtering and Kanban board view.</p>
    </div>
);

const AIWorkflowsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AI Workflows</h2>
        <p>Create and edit AI workflows using intuitive workflow builders, integrate performance metrics, and optimize with AI suggestions.</p>
    </div>
);

const BugTrackerView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Bug Tracker</h2>
        <p>Track and manage bugs: List reported bugs with severity levels, status tracking, and seamless GitHub integration.</p>
    </div>
);

const ProjectOverviewView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
        <p>Get a high-level view of all ongoing projects with progress trackers, resource allocation charts, and milestone indicators.</p>
    </div>
);

const TeamCollaborationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Team Collaboration</h2>
        <p>Collaborate efficiently: Internal messaging, file sharing, video conferencing, and real-time collaboration tools integrated into one platform.</p>
    </div>
);

const APIManagementView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">API Management</h2>
        <p>Manage APIs: Comprehensive documentation, key management, usage metrics, and testing tools all in one place.</p>
    </div>
);

const AnalyticsDashboardView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
        <p>Monitor performance: Key performance indicators, user engagement metrics, and team productivity analytics visualized for easy insights.</p>
    </div>
);

const SettingsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
        <p>Manage your account: Update information, security settings, and personal preferences seamlessly.</p>
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
                        <LineChart data={profileViewData}>
                            <XAxis dataKey="name" stroke="#ffffff" />
                            <YAxis stroke="#ffffff" />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="url(#colorGradient)" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="space-y-8">
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg">
                    <h3 className="text-xl font-semibold mb-4">Chat Assistant</h3>
                    <div className="h-64 bg-gray-700 bg-opacity-50 rounded-lg p-4 overflow-y-auto">
                        <p className="text-gray-300">Hello! I'm GROQY Assistant. How can I help you today?</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full mt-4 p-2 rounded-lg bg-gray-600 text-white focus:outline-none"
                    />
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

// Additional View Components for New Functionalities
const APIIntegrationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">API Integration</h2>
        <p>Integrate and manage your APIs: Connect with external services, manage endpoints, and monitor API performance.</p>
    </div>
);

const ChatBoardView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Chat Board</h2>
        <p>Real-time Communication: Engage with your team through integrated chat, direct messaging, and group discussions.</p>
    </div>
);

const FileUploadsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">File Uploads</h2>
        <p>Manage your files: Upload, organize, and share documents, images, and other files seamlessly within your workflows.</p>
    </div>
);

const WorkflowBuilderView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Workflow Builder</h2>
        <p>Create custom workflows: Design and automate your AI workflows with our intuitive builder interface.</p>
    </div>
);

const AGIAgentBuilderView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AGI Agent Builder</h2>
        <p>Build AGI Agents: Develop and customize intelligent agents to enhance your workflows and processes.</p>
    </div>
);

const GitHubIntegrationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">GitHub Integration</h2>
        <p>Seamless GitHub Integration: Connect your repositories, track commits, and manage pull requests directly from GROQY.</p>
    </div>
);

const IDEView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Integrated Development Environment (IDE)</h2>
        <p>Develop within GROQY: Access a fully-featured IDE to write, test, and deploy your code without leaving the platform.</p>
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
                return <APIIntegrationView />;
            case 'chatBoard':
                return <ChatBoardView />;
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
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 min-h-screen font-sans pb-20 md:pb-4">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">GROQY Dashboard</h1>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                    <Menu size={28} />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden">
                    <nav className="space-y-3 mb-8">
                        <NavButton
                            icon={Briefcase}
                            onClick={() => { setActiveView('home'); setMenuOpen(false); }}
                            isActive={activeView === 'home'}
                        >
                            Dashboard
                        </NavButton>
                        <NavButton
                            icon={FileText}
                            onClick={() => { setActiveView('tasks'); setMenuOpen(false); }}
                            isActive={activeView === 'tasks'}
                        >
                            Tasks
                        </NavButton>
                        <NavButton
                            icon={Zap}
                            onClick={() => { setActiveView('aiWorkflows'); setMenuOpen(false); }}
                            isActive={activeView === 'aiWorkflows'}
                        >
                            AI Workflows
                        </NavButton>
                        <NavButton
                            icon={Bug}
                            onClick={() => { setActiveView('bugTracker'); setMenuOpen(false); }}
                            isActive={activeView === 'bugTracker'}
                        >
                            Bug Tracker
                        </NavButton>
                        <NavButton
                            icon={GitBranch}
                            onClick={() => { setActiveView('githubIntegration'); setMenuOpen(false); }}
                            isActive={activeView === 'githubIntegration'}
                        >
                            GitHub Integration
                        </NavButton>
                        <NavButton
                            icon={Users}
                            onClick={() => { setActiveView('teamCollaboration'); setMenuOpen(false); }}
                            isActive={activeView === 'teamCollaboration'}
                        >
                            Team Collaboration
                        </NavButton>
                        <NavButton
                            icon={Settings}
                            onClick={() => { setActiveView('settings'); setMenuOpen(false); }}
                            isActive={activeView === 'settings'}
                        >
                            Settings
                        </NavButton>
                        {/* Dropdown for Additional Features */}
                        <NavButton
                            icon={Zap}
                            dropdown
                            dropdownItems={[
                                { label: 'API Integration', value: 'apiIntegration', onClick: () => setActiveView('apiIntegration') },
                                { label: 'Chat Board', value: 'chatBoard', onClick: () => setActiveView('chatBoard') },
                                { label: 'File Uploads', value: 'fileUploads', onClick: () => setActiveView('fileUploads') },
                                { label: 'Workflow Builder', value: 'workflowBuilder', onClick: () => setActiveView('workflowBuilder') },
                                { label: 'AGI Agent Builder', value: 'agiAgentBuilder', onClick: () => setActiveView('agiAgentBuilder') },
                                { label: 'IDE', value: 'ide', onClick: () => setActiveView('ide') },
                            ]}
                            isActive={false} // Dropdown doesn't have an active state
                        >
                            More
                        </NavButton>
                    </nav>
                </div>
            )}

            <div className="max-w-7xl mx-auto md:flex md:gap-8">
                {/* Sidebar - hidden on mobile */}
                <div className="hidden md:flex md:w-1/4 flex-col justify-between bg-gray-800 bg-opacity-50 rounded-2xl p-6 backdrop-filter backdrop-blur-lg">
                    <div>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">GROQY AI</h1>
                            <div className="flex items-center space-x-3 mb-4">
                                <img src="https://i.ibb.co/tDxBcPq/Pitch-Deck-Logo-Asset-V7.png" alt="User" className="w-10 h-10 rounded-full ring-2 ring-purple-500" />
                                <div>
                                    <span className="text-xl font-semibold">CeeCee</span>
                                    <p className="text-sm text-gray-400">CTO</p>
                                </div>
                            </div>
                        </div>
                        <nav className="space-y-3 mb-8">
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
                                icon={Settings}
                                onClick={() => setActiveView('settings')}
                                isActive={activeView === 'settings'}
                            >
                                Settings
                            </NavButton>
                            {/* Dropdown for Additional Features */}
                            <NavButton
                                icon={Zap}
                                dropdown
                                dropdownItems={[
                                    { label: 'API Integration', value: 'apiIntegration', onClick: () => setActiveView('apiIntegration') },
                                    { label: 'Chat Board', value: 'chatBoard', onClick: () => setActiveView('chatBoard') },
                                    { label: 'File Uploads', value: 'fileUploads', onClick: () => setActiveView('fileUploads') },
                                    { label: 'Workflow Builder', value: 'workflowBuilder', onClick: () => setActiveView('workflowBuilder') },
                                    { label: 'AGI Agent Builder', value: 'agiAgentBuilder', onClick: () => setActiveView('agiAgentBuilder') },
                                    { label: 'IDE', value: 'ide', onClick: () => setActiveView('ide') },
                                ]}
                                isActive={false} // Dropdown doesn't have an active state
                            >
                                More
                            </NavButton>
                        </nav>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                                <img src="https://i.ibb.co/tDxBcPq/Pitch-Deck-Logo-Asset-V7.png" alt="User" className="w-8 h-8 rounded-full ring-2 ring-white" />
                                <div>
                                    <p className="font-semibold">CeeCee</p>
                                    <p className="text-sm text-gray-200">Online</p>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-20 p-2 rounded-lg text-center backdrop-filter backdrop-blur-sm">
                                <p className="text-sm">Productivity Score</p>
                                <p className="text-2xl font-bold">92%</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                                <Disc className="text-white" size={20} />
                                <div>
                                    <p className="font-semibold">GROQY Community</p>
                                    <p className="text-sm text-gray-200">Join our forums and discussions</p>
                                </div>
                            </div>
                            <button className="w-full p-3 bg-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                                <ExternalLink className="mr-2" size={20} />
                                View Public Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-3/4 space-y-8">
                    {/* Header with search */}
                    <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 rounded-xl p-4 backdrop-filter backdrop-blur-lg">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tasks, workflows, bugs..."
                                className="w-96 bg-gray-700 bg-opacity-50 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Bell className="text-gray-400 cursor-pointer" />
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Active Tasks', value: '28', icon: FileText, color: 'from-blue-500 to-blue-600' },
                            { label: 'Open Bugs', value: '7', icon: Bug, color: 'from-red-500 to-red-600' },
                            { label: 'AI Workflows', value: '15', icon: Zap, color: 'from-green-500 to-green-600' },
                            { label: 'Team Members', value: '12', icon: Users, color: 'from-purple-500 to-purple-600' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-400 text-sm">{label}</p>
                                        <p className="text-2xl font-bold mt-1">{value}</p>
                                    </div>
                                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-full flex items-center justify-center`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                        <h2 className="text-2xl font-bold mb-4">Weekly Overview</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={taskData}>
                                <XAxis dataKey="name" stroke="#8884d8" />
                                <YAxis stroke="#8884d8" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
                                <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="bugs" stroke="#82ca9d" strokeWidth={2} />
                                <Line type="monotone" dataKey="workflows" stroke="#ffc658" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Activities and Integrations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                            <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
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
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg transform hover:scale-105 transition-transform duration-300">
                            <h2 className="text-xl font-bold mb-4">Integrations</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                                    <MessageSquare className="text-green-400" />
                                    <span>Connected to #project-ai-hub channel</span>
                                </div>
                                <button className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                                    Send Update to Slack
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Render Active View */}
                    {renderView()}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
                <nav className="flex justify-around space-x-2">
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
                        icon={Settings}
                        onClick={() => setActiveView('settings')}
                        isActive={activeView === 'settings'}
                    >
                        Settings
                    </NavButton>
                </nav>
            </div>
        </div>
    );
}