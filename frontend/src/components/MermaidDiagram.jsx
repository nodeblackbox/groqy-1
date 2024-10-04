"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ code, theme }) => {
    const mermaidRef = useRef(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme === "dark" ? "dark" : "default",
        });

        if (mermaidRef.current && code)
        {
            mermaid.render("mermaid-diagram", code).then((result) => {
                mermaidRef.current.innerHTML = result.svg;
            });
        }
    }, [code, theme]);

    return <div ref={mermaidRef} />;
};

export default MermaidDiagram;