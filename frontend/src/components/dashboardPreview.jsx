"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Bell, Search, Menu, FileText, Zap, Bug, GitBranch, Users, Briefcase, Settings, MessageSquare } from 'lucide-react';

const data = [
    { name: 'Mon', tasks: 12, bugs: 5, workflows: 3 },
    { name: 'Tue', tasks: 19, bugs: 3, workflows: 5 },
    { name: 'Wed', tasks: 15, bugs: 7, workflows: 4 },
    { name: 'Thu', tasks: 22, bugs: 2, workflows: 6 },
    { name: 'Fri', tasks: 18, bugs: 4, workflows: 5 },
    { name: 'Sat', tasks: 10, bugs: 1, workflows: 2 },
    { name: 'Sun', tasks: 8, bugs: 0, workflows: 1 },
];

const NavButton = ({ children, icon: Icon, onClick, isActive }) => (
    <button
        className={`w-full p-3 text-left rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center ${isActive ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
        onClick={onClick}
    >
        <Icon className="mr-3" size={20} />
        {children}
    </button>
);

const TaskManagementView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Task Management</h2>
        {/* Add task management components here */}
        <p>Task Management Center: Create, assign, and track tasks, with filtering options and Kanban board view.</p>
    </div>
);

const AIWorkflowsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">AGI Workflows</h2>
        {/* Add AGI Workflows components here */}
        <p>AGI workflows Hub: Create and edit AGI Workflows To make agi, Using mermaid with performance metrics and optimization suggestions Model selection Mermaid editor And workflow editor. </p>
    </div>
);

const BugTrackerView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Bug Tracker</h2>
        {/* Add bug tracker components here */}
        <p>Bug Tracking System: List of reported bugs with severity levels, status tracking, and GitHub integration.</p>
    </div>
);

const ProjectOverviewView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
        {/* Add project overview components here */}
        <p>Project Overview: High-level view of all ongoing projects, progress trackers, and resource allocation charts.</p>
    </div>
);

const TeamCollaborationView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Team Collaboration</h2>
        {/* Add team collaboration components here */}
        <p>Team Collaboration Space: Internal messaging system, file sharing, and video conferencing integration.</p>
    </div>
);

const APIManagementView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">API Management</h2>
        {/* Add API management components here */}
        <p>API Management: Documentation for internal and external APIs, key management, and usage metrics.</p>
    </div>
);

const AnalyticsDashboardView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
        {/* Add analytics dashboard components here */}
        <p>Analytics Dashboard: Key performance indicators, user engagement metrics, and team productivity analytics.</p>
    </div>
);

const SettingsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
        {/* Add account settings components here */}
        <p>Account Settings: Manage your account information, security settings, and preferences.</p>
    </div>
);

const Dashboard = () => {
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
            default:
                return <TaskManagementView />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 min-h-screen font-sans">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                    <Menu size={28} />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden">
                    <nav className="space-y-3 mb-8">
                        <NavButton icon={Briefcase} onClick={() => { setActiveView('home'); setMenuOpen(false); }} isActive={activeView === 'home'}>Dashboard</NavButton>
                        <NavButton icon={FileText} onClick={() => { setActiveView('tasks'); setMenuOpen(false); }} isActive={activeView === 'tasks'}>Tasks</NavButton>
                        <NavButton icon={Zap} onClick={() => { setActiveView('aiWorkflows'); setMenuOpen(false); }} isActive={activeView === 'aiWorkflows'}>AGI Workflows</NavButton>
                        <NavButton icon={Bug} onClick={() => { setActiveView('bugTracker'); setMenuOpen(false); }} isActive={activeView === 'bugTracker'}>Bug Tracker</NavButton>
                        <NavButton icon={GitBranch} onClick={() => { setActiveView('github'); setMenuOpen(false); }} isActive={activeView === 'github'}>GitHub</NavButton>
                        <NavButton icon={Users} onClick={() => { setActiveView('teamCollaboration'); setMenuOpen(false); }} isActive={activeView === 'teamCollaboration'}>Team Collaboration</NavButton>
                        <NavButton icon={Settings} onClick={() => { setActiveView('settings'); setMenuOpen(false); }} isActive={activeView === 'settings'}>Settings</NavButton>
                    </nav>
                </div>
            )}

            <div className="max-w-7xl mx-auto md:flex md:gap-8">
                {/* Sidebar - hidden on mobile */}
                <div className="hidden md:flex md:w-1/4 flex-col justify-between bg-gray-800 bg-opacity-50 rounded-2xl p-6 backdrop-filter backdrop-blur-lg">
                    <div>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Groqy AI</h1>
                            <div className="flex items-center space-x-3 mb-4">
                                <img src="https://i.ibb.co/tDxBcPq/Pitch-Deck-Logo-Asset-V7.png" alt="User" className="w-10 h-10 rounded-full ring-2 ring-purple-500" />
                                <div>
                                    <span className="text-xl font-semibold">CeeCee</span>
                                    <p className="text-sm text-gray-400">CTO</p>
                                </div>
                            </div>
                        </div>
                        <nav className="space-y-3 mb-8">
                            <NavButton icon={Briefcase} onClick={() => setActiveView('home')} isActive={activeView === 'home'}>Dashboard</NavButton>
                            <NavButton icon={FileText} onClick={() => setActiveView('tasks')} isActive={activeView === 'tasks'}>Tasks</NavButton>
                            <NavButton icon={Zap} onClick={() => setActiveView('aiWorkflows')} isActive={activeView === 'aiWorkflows'}>AGI Workflows</NavButton>
                            <NavButton icon={Bug} onClick={() => setActiveView('bugTracker')} isActive={activeView === 'bugTracker'}>Bug Tracker</NavButton>
                            <NavButton icon={GitBranch} onClick={() => setActiveView('github')} isActive={activeView === 'github'}>GitHub</NavButton>
                            <NavButton icon={Users} onClick={() => setActiveView('teamCollaboration')} isActive={activeView === 'teamCollaboration'}>Team Collaboration</NavButton>
                            <NavButton icon={Settings} onClick={() => setActiveView('settings')} isActive={activeView === 'settings'}>Settings</NavButton>
                        </nav>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-xl shadow-lg">
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
                    <div className="grid grid-cols-4 gap-6">
                        {[
                            { label: 'Active Tasks', value: '28', icon: FileText, color: 'from-blue-500 to-blue-600' },
                            { label: 'Open Bugs', value: '7', icon: Bug, color: 'from-red-500 to-red-600' },
                            { label: 'AGI Workflows', value: '15', icon: Zap, color: 'from-green-500 to-green-600' },
                            { label: 'Team Members', value: '12', icon: Users, color: 'from-purple-500 to-purple-600' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
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
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-bold mb-4">Weekly Overview</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis dataKey="name" stroke="#8884d8" />
                                <YAxis stroke="#8884d8" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
                                <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="bugs" stroke="#82ca9d" strokeWidth={2} />
                                <Line type="monotone" dataKey="workflows" stroke="#ffc658" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Activities and Slack Integration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                            <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
                            <ul className="space-y-4">
                                {[
                                    'New AGI workflows created for pitch deck optimization',
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
                        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                            <h2 className="text-xl font-bold mb-4">Slack Integration</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                                    <MessageSquare className="text-green-400" />
                                    <span>Connected to #project-ai-hub channel</span>
                                </div>
                                <button className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                                    Send Update to Slack
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
                <nav className="flex justify-around">
                    <NavButton icon={Briefcase} onClick={() => setActiveView('home')} isActive={activeView === 'home'}>Home</NavButton>
                    <NavButton icon={FileText} onClick={() => setActiveView('tasks')} isActive={activeView === 'tasks'}>Tasks</NavButton>
                    <NavButton icon={Zap} onClick={() => setActiveView('aiWorkflows')} isActive={activeView === 'aiWorkflows'}>AI</NavButton>
                    <NavButton icon={Bug} onClick={() => setActiveView('bugTracker')} isActive={activeView === 'bugTracker'}>Bugs</NavButton>
                    <NavButton icon={Settings} onClick={() => setActiveView('settings')} isActive={activeView === 'settings'}>Settings</NavButton>
                </nav>
            </div>
        </div>
    );
};

export default Dashboard;
