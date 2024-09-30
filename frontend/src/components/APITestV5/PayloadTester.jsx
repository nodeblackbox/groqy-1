// frontend/src/components/APITestV5/PayloadTester.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Code, Copy, Play, Download, Upload, Trash, Plus } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal'; // Ensure you have this component
import { saveAs } from 'file-saver';
import dynamic from 'next/dynamic';
import 'jsoneditor-react/es/editor.min.css';

// Dynamically import JSONEditor to prevent SSR issues
// Correct dynamic import for jsoneditor-react
const JSONEditor = dynamic(() => import('jsoneditor-react').then(mod => mod.default), { ssr: false });

const PayloadTester = () => {
    const [testPayload, setTestPayload] = useState('');
    const [testResult, setTestResult] = useState('');
    const [payloads, setPayloads] = useState([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedPayload, setImportedPayload] = useState('');
    const [editorOptions, setEditorOptions] = useState({
        mode: 'code', // 'code' or 'tree'
        onError: (err) => {
            toast.error(`JSON Editor Error: ${err.toString()}`);
        },
    });

    // Load payloads from localStorage on mount
    useEffect(() => {
        const storedPayloads = JSON.parse(localStorage.getItem('payloads')) || [];
        setPayloads(storedPayloads);
    }, []);

    // Save payloads to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('payloads', JSON.stringify(payloads));
    }, [payloads]);

    const handleSendPayload = async (payload) => {
        try
        {
            const response = await fetch('/api/qdrant/create-point', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if needed
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok)
            {
                setTestResult(JSON.stringify(data, null, 2));
                toast.success('Payload sent successfully!');
            } else
            {
                setTestResult(data.message || 'Failed to send payload.');
                toast.error(data.message || 'Failed to send payload.');
            }
        } catch (error)
        {
            console.error('Send Payload Error:', error);
            setTestResult('An error occurred.');
            toast.error('An error occurred while sending the payload.');
        }
    };

    const handleAddPayload = () => {
        if (!testPayload.trim())
        {
            toast.error('Payload cannot be empty.');
            return;
        }
        try
        {
            const parsed = JSON.parse(testPayload);
            const newPayload = {
                id: Date.now(),
                name: `Payload_${payloads.length + 1}`,
                content: parsed,
            };
            setPayloads([...payloads, newPayload]);
            setTestPayload('');
            toast.success('Payload added successfully!');
        } catch (error)
        {
            toast.error('Invalid JSON payload.');
        }
    };

    const handleDeletePayload = (id) => {
        const updatedPayloads = payloads.filter((payload) => payload.id !== id);
        setPayloads(updatedPayloads);
        toast.success('Payload deleted.');
    };

    const handleExportPayload = (payload) => {
        const blob = new Blob([JSON.stringify(payload.content, null, 2)], { type: 'application/json' });
        saveAs(blob, `${payload.name}.json`);
        toast.success('Payload exported.');
    };

    const handleImportPayload = () => {
        try
        {
            const parsed = JSON.parse(importedPayload);
            const newPayload = {
                id: Date.now(),
                name: `Payload_${payloads.length + 1}`,
                content: parsed,
            };
            setPayloads([...payloads, newPayload]);
            setIsImportModalOpen(false);
            setImportedPayload('');
            toast.success('Payload imported successfully!');
        } catch (error)
        {
            toast.error('Invalid JSON payload.');
        }
    };

    const handleTestAll = async () => {
        if (payloads.length === 0)
        {
            toast.error('No payloads to test.');
            return;
        }
        for (const payload of payloads)
        {
            await handleSendPayload(payload.content);
        }
        toast.success('All payloads tested.');
    };

    const handleCopyPayload = () => {
        toast.success('Payload copied to clipboard!');
    };

    const handleEditorChange = (json) => {
        setTestPayload(JSON.stringify(json, null, 2));
    };

    const handleExportAll = () => {
        const allPayloads = payloads.map(payload => payload.content);
        const blob = new Blob([JSON.stringify(allPayloads, null, 2)], { type: 'application/json' });
        saveAs(blob, `All_Payloads_${Date.now()}.json`);
        toast.success('All payloads exported.');
    };

    return (
        <div className="bg-black p-6 rounded-xl mb-4 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Payload Tester</h2>
            <div className="space-y-4">
                {/* Create New Payload Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-medium">Create New Payload</h3>
                        <Button onClick={handleAddPayload} className="bg-green-600 hover:bg-green-700 flex items-center">
                            <Plus size={16} className="mr-1" /> Add Payload
                        </Button>
                    </div>
                    <JSONEditor
                        value={testPayload ? JSON.parse(testPayload) : {}}
                        onChange={handleEditorChange}
                        mode={editorOptions.mode}
                        onError={editorOptions.onError}
                        theme="dark"
                        history={true}
                        navigationBar={true}
                        statusBar={true}
                        search={true}
                        onModeChange={(mode) => setEditorOptions({ ...editorOptions, mode })}
                        headerToolbar={[
                            {
                                label: 'Copy Payload',
                                onClick: () => {
                                    navigator.clipboard.writeText(testPayload);
                                    handleCopyPayload();
                                },
                                icon: <Copy size={16} />,
                            },
                        ]}
                    />
                    <div className="flex space-x-4">
                        <Button
                            onClick={() => handleSendPayload(JSON.parse(testPayload))}
                            className="bg-blue-600 hover:bg-blue-700 flex items-center"
                        >
                            <Play size={16} className="mr-1" /> Send Payload
                        </Button>
                        <Button
                            onClick={handleTestAll}
                            className="bg-purple-600 hover:bg-purple-700 flex items-center"
                        >
                            <Code size={16} className="mr-1" /> Test All
                        </Button>
                        <Button
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                        >
                            <Upload size={16} className="mr-1" /> Import Payload
                        </Button>
                        <Button
                            onClick={handleExportAll}
                            className="bg-teal-600 hover:bg-teal-700 flex items-center"
                        >
                            <Download size={16} className="mr-1" /> Export All
                        </Button>
                    </div>
                </div>
            </div>

            {/* Saved Payloads List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium">Saved Payloads</h3>
                    <Button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                    >
                        <Upload size={16} className="mr-1" /> Import Payload
                    </Button>
                </div>
                {payloads.length === 0 ? (
                    <p className="text-gray-400">No payloads saved. Add a new payload above.</p>
                ) : (
                    <ul className="space-y-2">
                        {payloads.map((payload) => (
                            <li key={payload.id} className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold">{payload.name}</h4>
                                        <CopyToClipboard text={JSON.stringify(payload.content, null, 2)} onCopy={handleCopyPayload}>
                                            <Button variant="ghost" size="sm">
                                                <Copy size={16} />
                                            </Button>
                                        </CopyToClipboard>
                                    </div>
                                    <JSONEditor
                                        value={payload.content}
                                        onChange={() => { }}
                                        mode="view"
                                        theme="dark"
                                        navigationBar={false}
                                        history={false}
                                        search={false}
                                        onError={editorOptions.onError}
                                        allowEdit={false}
                                        style={{ height: '150px' }}
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <Button
                                            onClick={() => handleSendPayload(payload.content)}
                                            className="bg-blue-600 hover:bg-blue-700 flex items-center"
                                        >
                                            <Play size={16} className="mr-1" /> Send
                                        </Button>
                                        <Button
                                            onClick={() => handleExportPayload(payload)}
                                            className="bg-teal-600 hover:bg-teal-700 flex items-center"
                                        >
                                            <Download size={16} className="mr-1" /> Export
                                        </Button>
                                        <Button
                                            onClick={() => handleDeletePayload(payload.id)}
                                            className="bg-red-600 hover:bg-red-700 flex items-center"
                                        >
                                            <Trash size={16} className="mr-1" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Test Result Section */}
            {testResult && (
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Test Result</h3>
                    <pre className="bg-gray-700 p-2 rounded-lg overflow-auto max-h-64">
                        {testResult}
                    </pre>
                </div>
            )}

            {/* Import Payload Modal */}
            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
                <ModalHeader>Import Payload</ModalHeader>
                <ModalBody>
                    <JSONEditor
                        value={importedPayload ? JSON.parse(importedPayload) : {}}
                        onChange={(json) => setImportedPayload(JSON.stringify(json, null, 2))}
                        mode="code"
                        theme="dark"
                        history={true}
                        navigationBar={true}
                        statusBar={true}
                        search={true}
                        onError={editorOptions.onError}
                        headerToolbar={[
                            {
                                label: 'Copy Imported Payload',
                                onClick: () => {
                                    navigator.clipboard.writeText(importedPayload);
                                    handleCopyPayload();
                                },
                                icon: <Copy size={16} />,
                            },
                        ]}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={handleImportPayload}
                        className="bg-green-600 hover:bg-green-700 flex items-center"
                    >
                        <Upload size={16} className="mr-1" /> Import
                    </Button>
                    <Button
                        onClick={() => setIsImportModalOpen(false)}
                        className="bg-gray-600 hover:bg-gray-700 flex items-center"
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default PayloadTester;
