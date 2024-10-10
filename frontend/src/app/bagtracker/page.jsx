"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Bug, AlertTriangle, CheckCircle, Plus, X, Edit, Trash2, RefreshCw, Loader } from 'lucide-react';

const stages = ["Planning", "Analysis", "Design", "Development", "Testing", "Maintenance", "Closed"];

const BugCard = ({ bug, onStatusChange, onEdit, onDelete }) => (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <h3 className="text-lg font-semibold mb-2 text-white">{bug.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{bug.description}</p>
        <div className="flex justify-between items-center mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bug.status === 'Open' ? 'bg-red-900 text-red-200' :
                bug.status === 'In Progress' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                }`}>
                {bug.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bug.priority === 'High' ? 'bg-red-900 text-red-200' :
                bug.priority === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                }`}>
                {bug.priority}
            </span>
        </div>
        <div className="flex justify-between items-center">
            <select
                value={bug.stage}
                onChange={(e) => onStatusChange(bug.id, e.target.value)}
                className="bg-gray-700 text-white text-sm rounded-lg p-1 hover:bg-gray-600 transition-colors duration-300"
            >
                {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                ))}
            </select>
            <div className="flex space-x-2">
                <button onClick={() => onEdit(bug)} className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(bug.id)} className="text-red-400 hover:text-red-300 transition-colors duration-300">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

const BugForm = ({ bug, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(bug || { title: '', description: '', status: 'Open', priority: 'Medium', stage: 'Planning' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-indigo-500 shadow-lg shadow-indigo-500/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-white">{bug ? 'Edit Bug' : 'Submit a New Bug'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Bug Title"
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Bug Description"
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                    <div className="flex space-x-4">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-1/2 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-1/2 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {stages.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105">
                        {bug ? 'Update Bug' : 'Submit Bug'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const BugTracker = () => {
    const [bugs, setBugs] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBug, setEditingBug] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBugs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try
        {
            const response = await fetch('/api/bugtracker');
            if (!response.ok)
            {
                throw new Error('Failed to fetch bugs');
            }
            const data = await response.json();
            setBugs(data);
        } catch (err)
        {
            setError(err.message);
        } finally
        {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBugs();
        // Set up auto-update every 30 seconds
        const intervalId = setInterval(fetchBugs, 30000);
        return () => clearInterval(intervalId);
    }, [fetchBugs]);

    const handleSubmit = async (bugData) => {
        setIsLoading(true);
        setError(null);
        try
        {
            const url = '/api/bugtracker';
            const method = editingBug ? 'PUT' : 'POST';
            const body = editingBug ? JSON.stringify({ ...bugData, id: editingBug.id }) : JSON.stringify(bugData);

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });

            if (!response.ok)
            {
                throw new Error('Failed to save bug');
            }

            await fetchBugs();
            setIsFormOpen(false);
            setEditingBug(null);
        } catch (err)
        {
            setError(err.message);
        } finally
        {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStage) => {
        setIsLoading(true);
        setError(null);
        try
        {
            const bugToUpdate = bugs.find(bug => bug.id === id);
            if (!bugToUpdate) throw new Error('Bug not found');

            const updatedBug = { ...bugToUpdate, stage: newStage };
            const response = await fetch('/api/bugtracker', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBug),
            });

            if (!response.ok)
            {
                throw new Error('Failed to update bug status');
            }

            await fetchBugs();
        } catch (err)
        {
            setError(err.message);
        } finally
        {
            setIsLoading(false);
        }
    };

    const handleEdit = (bug) => {
        setEditingBug(bug);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        setError(null);
        try
        {
            const response = await fetch('/api/bugtracker', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok)
            {
                throw new Error('Failed to delete bug');
            }

            await fetchBugs();
        } catch (err)
        {
            setError(err.message);
        } finally
        {
            setIsLoading(false);
        }
    };

    if (error)
    {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p>{error}</p>
                <button
                    onClick={fetchBugs}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Bug Tracker
                </h1>
                <h2 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    agent workflow Builder
                </h2>
                <h2 className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    grock Task Manager
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg shadow-lg p-6 flex flex-col justify-between transform hover:scale-105 transition-all duration-300">
                        <div>
                            <Bug className="w-12 h-12 mb-4 text-indigo-300" />
                            <h2 className="text-2xl font-semibold mb-2">Total Bugs</h2>
                            <p className="text-4xl font-bold">{bugs.length}</p>
                        </div>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-500 transition-colors duration-300 flex items-center justify-center transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Add New Bug
                        </button>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                        <AlertTriangle className="w-12 h-12 mb-4 text-yellow-300" />
                        <h2 className="text-2xl font-semibold mb-2">Open Bugs</h2>
                        <p className="text-4xl font-bold">{bugs.filter(bug => bug.status === 'Open').length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-900 to-teal-900 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                        <CheckCircle className="w-12 h-12 mb-4 text-green-300" />
                        <h2 className="text-2xl font-semibold mb-2">Closed Bugs</h2>
                        <p className="text-4xl font-bold">{bugs.filter(bug => bug.status === 'Closed').length}</p>
                    </div>
                </div>

                {isFormOpen && (
                    <BugForm
                        bug={editingBug}
                        onSubmit={handleSubmit}
                        onClose={() => {
                            setIsFormOpen(false);
                            setEditingBug(null);
                        }}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center items-center">
                            <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                        </div>
                    ) : (
                        bugs.map((bug) => (
                            <BugCard
                                key={bug.id}
                                bug={bug}
                                onStatusChange={handleStatusChange}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}

                </div >

                {
                    bugs.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <p className="text-2xl text-gray-400">No bugs found. Yay! 🎉</p>
                            <p className="text-gray-500 mt-2">Add a new bug to get started.</p>
                        </div>
                    )
                }

                < div className="mt-8 text-center" >
                    <button
                        onClick={fetchBugs}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center mx-auto transform hover:scale-105"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Refresh Bugs
                    </button>
                </div >
            </div >
        </div >
    );
};

export default BugTracker;