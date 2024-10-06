"use client";

import React, { useState } from "react";

export default function QdrantQueryForm() {
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState("");
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(""); // State for custom prompt

  // Function to handle memory creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let metadataObj;
      try {
        metadataObj = JSON.parse(metadata); // Parse metadata input as JSON
      } catch (error) {
        setResponse("Error: Invalid JSON in metadata");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: title,
          metadata: metadataObj,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2)); // Display full response data
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while creating memory");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle memory recall
  const handleRecall = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          top_k: topK,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setResponse(JSON.stringify(data.memories, null, 2)); // Display the memories
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while recalling memories");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle custom prompt to the GravRAG API
  const handleCustomPrompt = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: customPrompt,
          customPrompt: customPrompt,
          context: { user: "Test User" }, // Add any additional context here
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2)); // Display API response
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while processing the custom prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Memory Management
        </h2>
      </div>
      <div className="p-4">
        {/* Create Memory Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter memory content (title)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              placeholder="Enter JSON metadata"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            {isLoading ? "Submitting..." : "Submit Memory"}
          </button>
        </form>

        {/* Recall Memory Form */}
        <form onSubmit={handleRecall} className="space-y-4 mt-8">
          <div>
            <input
              type="text"
              placeholder="Enter recall query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Top K (default: 5)"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            {isLoading ? "Recalling..." : "Recall Memory"}
          </button>
        </form>

        {/* Custom Prompt Form */}
        <form onSubmit={handleCustomPrompt} className="space-y-4 mt-8">
          <div>
            <input
              type="text"
              placeholder="Enter custom prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            {isLoading ? "Processing..." : "Send Prompt"}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Response:
          </h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-sm">
            {response || "No response yet"}
          </pre>
        </div>
      </div>
    </div>
  );
}
