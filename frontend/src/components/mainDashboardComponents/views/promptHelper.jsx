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
