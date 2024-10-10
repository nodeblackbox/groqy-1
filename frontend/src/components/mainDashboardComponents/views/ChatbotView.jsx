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
