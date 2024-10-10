// frontend/src/components/mainDashboardComponents/views/IDEView.jsx

"use client";

import React from "@components/mainDashboardComponents/Button";

const IDEView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Integrated Development Environment</h2>
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
            {/* Tabs for Files */}
            <div className="flex space-x-2 mb-4">
                <button className="px-4 py-2 bg-gray-700 rounded-t-lg">main.js</button>
                <button className="px-4 py-2 bg-gray-600 rounded-t-lg">styles.css</button>
                <button className="px-4 py-2 bg-gray-600 rounded-t-lg">index.html</button>
            </div>

            {/* Code Editor */}
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

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between">
                <Button variant="primary">Run</Button>
                <Button variant="success">Save</Button>
            </div>
        </div>
    </div>
);

export default IDEView;
