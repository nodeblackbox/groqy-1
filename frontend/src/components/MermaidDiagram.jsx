// components/MermaidDiagram.jsx
"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const MermaidDiagram = ({ code }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (code) {
            mermaid.initialize({ startOnLoad: true });
            mermaid.contentLoaded();
            mermaid.render("generatedDiagram", code, (svgCode) => {
                if (chartRef.current) {
                    chartRef.current.innerHTML = svgCode;
                }
            });
        }
    }, [code]);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Workflow Diagram</h2>
            <div ref={chartRef} className="mermaid"></div>
        </div>
    );
};

export default MermaidDiagram;
