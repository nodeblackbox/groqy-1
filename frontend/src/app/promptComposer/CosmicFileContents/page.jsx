"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CosmicFileContents({ selectedFiles }) {
    const [fileContents, setFileContents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedFiles, setCopiedFiles] = useState({});

    useEffect(() => {
        const fetchFileContents = async () => {
            setLoading(true);
            setError(null);
            try
            {
                const response = await fetch('/api/get-file-contents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: selectedFiles }),
                });
                if (!response.ok)
                {
                    throw new Error('Failed to fetch file contents');
                }
                const data = await response.json();
                setFileContents(data.fileContents);
            } catch (err)
            {
                setError(err.message);
            } finally
            {
                setLoading(false);
            }
        };

        if (selectedFiles.length > 0)
        {
            fetchFileContents();
        }
    }, [selectedFiles]);

    const copyToClipboard = (text, filePath = null) => {
        navigator.clipboard.writeText(text).then(() => {
            if (filePath)
            {
                setCopiedFiles(prev => ({ ...prev, [filePath]: true }));
                setTimeout(() => setCopiedFiles(prev => ({ ...prev, [filePath]: false })), 2000);
            } else
            {
                setCopiedFiles({ all: true });
                setTimeout(() => setCopiedFiles({ all: false }), 2000);
            }
        });
    };

    const copyAllContents = () => {
        const allContent = selectedFiles.map(filePath =>
            `File: ${filePath}\n\n${fileContents[filePath] || 'Content not available'}\n\n`
        ).join('---\n\n');
        copyToClipboard(allContent);
    };

    if (loading)
    {
        return <div className="text-center text-purple-300">Loading cosmic file contents...</div>;
    }

    if (error)
    {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <Card className="bg-gray-800 mt-8">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-300">
                    <span className="flex items-center">
                        <FileText className="mr-2" />
                        Cosmic File Contents
                    </span>
                    <Button
                        onClick={copyAllContents}
                        className={`${copiedFiles.all ? 'bg-green-600' : 'bg-purple-600'} hover:bg-purple-700`}
                    >
                        {copiedFiles.all ? <Check className="mr-2" /> : <Copy className="mr-2" />}
                        {copiedFiles.all ? 'Copied All!' : 'Copy All'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[600px]">
                    {selectedFiles.map((filePath) => (
                        <Collapsible key={filePath} className="mb-4">
                            <CollapsibleTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        {filePath}
                                    </span>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(`File: ${filePath}\n\n${fileContents[filePath] || 'Content not available'}`, filePath);
                                        }}
                                        className={`${copiedFiles[filePath] ? 'bg-green-600' : 'bg-purple-600'} hover:bg-purple-700`}
                                        size="sm"
                                    >
                                        {copiedFiles[filePath] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={dracula}
                                    className="mt-2 rounded-lg"
                                >
                                    {fileContents[filePath] || 'Content not available'}
                                </SyntaxHighlighter>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}