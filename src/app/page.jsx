"use client"

import React, { useState } from 'react';
import { MessageSquare, BarChart2, Search, FileText, Link } from 'lucide-react';

export default function RockyAgentDashboard() {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const handleSendMessage = () => {
        if (message.trim()) {
            setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
            setMessage('');
            // Here you would typically call an API to get the agent's response
            // For now, we'll just simulate a response
            setTimeout(() => {
                setChatMessages(prev => [...prev, { text: "I've received your message. How can I assist you?", sender: 'agent' }]);
            }, 1000);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
            <header className="bg-gray-800 shadow-lg">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">Rocky Agent</div>
                        <div className="space-x-4">
                            <a href="#" className="hover:text-gray-300">Dashboard</a>
                            <a href="#" className="hover:text-gray-300">Commands</a>
                            <a href="#" className="hover:text-gray-300">Tools</a>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold mb-8">Welcome to Rocky Agent Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-700 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold mb-4">Chat Interface</h2>
                        <div className="bg-gray-800 rounded-lg p-4 h-64 mb-4 overflow-y-auto">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                    <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                        {msg.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow bg-gray-600 rounded-l-lg px-4 py-2 focus:outline-none text-white"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-500 hover:bg-blue-600 rounded-r-lg px-4 py-2"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold mb-4">Available Commands</h2>
                        <ul className="space-y-2">
                            <li className="bg-gray-600 rounded px-3 py-2 flex items-center">
                                <BarChart2 className="mr-2" size={20} /> Analyze Data
                            </li>
                            <li className="bg-gray-600 rounded px-3 py-2 flex items-center">
                                <Search className="mr-2" size={20} /> Search Documents
                            </li>
                            <li className="bg-gray-600 rounded px-3 py-2 flex items-center">
                                <FileText className="mr-2" size={20} /> Generate Report
                            </li>
                            <li className="bg-gray-600 rounded px-3 py-2 flex items-center">
                                <Link className="mr-2" size={20} /> Connect API
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>
                    <p className="mb-4">Rocky Agent utilizes our advanced RAG (Retrieval-Augmented Generation) Gravity model to provide powerful backend functionality. This allows for seamless integration with various tools and APIs, enhancing your workflow and productivity.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-700 rounded-lg shadow-xl p-6">
                            <h3 className="text-xl font-semibold mb-2">RAG Gravity Model</h3>
                            <p>Harness the power of our state-of-the-art language model for complex tasks and decision-making.</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg shadow-xl p-6">
                            <h3 className="text-xl font-semibold mb-2">Tool Integration</h3>
                            <p>Connect and control various external tools and services through natural language commands.</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg shadow-xl p-6">
                            <h3 className="text-xl font-semibold mb-2">Customizable Workflows</h3>
                            <p>Create and modify automated workflows to streamline your daily tasks and processes.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 mt-12">
                <div className="container mx-auto px-6 py-4 text-center">
                    <p>&copy; 2024 Rocky Agent. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}