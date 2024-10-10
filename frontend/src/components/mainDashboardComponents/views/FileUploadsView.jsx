// frontend/src/components/mainDashboardComponents/views/FileUploadsView.jsx

"use client";

import React from "react";
import Button from "../Button";

const FileUploadsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">File Uploads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload New File */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Upload New File</h3>
                <form className="space-y-4">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-600 transition-colors">
                        <p>Drag and drop files here or click to select</p>
                        <input type="file" className="hidden" />
                    </div>
                    <Button variant="primary" className="w-full">
                        Upload
                    </Button>
                </form>
            </div>

            {/* Recent Uploads */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
                <ul className="space-y-2">
                    {[
                        { name: "project_requirements.pdf", size: "2.5 MB", date: "2023-06-15" },
                        { name: "design_mockup.psd", size: "15.7 MB", date: "2023-06-14" },
                        { name: "database_schema.sql", size: "4.2 KB", date: "2023-06-13" },
                        { name: "api_documentation.md", size: "18.9 KB", date: "2023-06-12" },
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

export default FileUploadsView;
