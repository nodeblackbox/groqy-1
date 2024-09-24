"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';


// MermaidDiagram Component
const MermaidDiagramComponent = ({ code, theme }) => {
    const mermaidRef = useRef(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme === "dark" ? "dark" : "default",
        });

        if (mermaidRef.current && code) {
            mermaid.render("mermaid-diagram", code).then((result) => {
                mermaidRef.current.innerHTML = result;
            });
        }
    }, [code, theme]);

    return <div ref={mermaidRef} />;
};

export default MermaidDiagramComponent;
