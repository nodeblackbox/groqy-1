// components/ErrorLog.jsx
"use client";

import React from 'react';

const ErrorLog = ({ errorLog }) => {
    return (
        <div className="p-4 bg-gray-800 border-t border-cyan-700">
            <h2 className="text-lg font-bold text-cyan-400 mb-2">Error Log</h2>
            <ul className="list-disc list-inside text-red-400">
                {errorLog.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        </div>
    );
};

export default ErrorLog;