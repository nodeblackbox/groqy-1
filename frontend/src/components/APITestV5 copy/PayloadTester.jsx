import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Code, Copy, Play, Download, Upload, Trash, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { saveAs } from 'file-saver';



const SimpleJSONEditor = ({ value, onChange, readOnly = false }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className="w-full h-64 p-2 font-mono text-sm bg-gray-800 text-white border border-gray-700 rounded"
            style={{ resize: 'vertical' }}
        />
    );
};

const PayloadTester = () => {
    const [testPayload, setTestPayload] = useState('{\n  \n}');
    const [testResult, setTestResult] = useState('');
    const [payloads, setPayloads] = useState([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedPayload, setImportedPayload] = useState('{\n  \n}');

    useEffect(() => {
        const storedPayloads = JSON.parse(localStorage.getItem('payloads') || '[]');
        setPayloads(storedPayloads);
    }, []);

    useEffect(() => {
        localStorage.setItem('payloads', JSON.stringify(payloads));
    }, [payloads]);

    const handleSendPayload = async (payload) => {
        try
        {
            const response = await fetch('/api/qdrant/create-point', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        try
        {
            const parsed = JSON.parse(testPayload);
            const newPayload = {
                id: Date.now(),
                name: `Payload_${payloads.length + 1}`,
                content: parsed,
            };
            setPayloads([...payloads, newPayload]);
            setTestPayload('{\n  \n}');
            toast.success('Payload added successfully!');
        } catch (error)
        {
            toast.error('Invalid JSON payload.');
        }
    };

    const handleDeletePayload = (id) => {
        setPayloads(payloads.filter((payload) => payload.id !== id));
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
            setImportedPayload('{\n  \n}');
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

    const handleExportAll = () => {
        const allPayloads = payloads.map(payload => payload.content);
        const blob = new Blob([JSON.stringify(allPayloads, null, 2)], { type: 'application/json' });
        saveAs(blob, `All_Payloads_${Date.now()}.json`);
        toast.success('All payloads exported.');
    };

    return (
        <div className="bg-gray-900 p-6 rounded-xl mb-4 space-y-6 text-white">
            <h2 className="text-3xl font-semibold mb-4">Payload Tester</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-medium">Create New Payload</h3>
                        <Button onClick={handleAddPayload} className="bg-green-600 hover:bg-green-700 flex items-center">
                            <Plus size={16} className="mr-1" /> Add Payload
                        </Button>
                    </div>
                    <SimpleJSONEditor
                        value={testPayload}
                        onChange={setTestPayload}
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

            <div className="space-y-4">
                <h3 className="text-2xl font-medium">Saved Payloads</h3>
                {payloads.length === 0 ? (
                    <p className="text-gray-400">No payloads saved. Add a new payload above.</p>
                ) : (
                    <ul className="space-y-4">
                        {payloads.map((payload) => (
                            <li key={payload.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-lg">{payload.name}</h4>
                                    <CopyToClipboard text={JSON.stringify(payload.content, null, 2)} onCopy={handleCopyPayload}>
                                        <Button variant="ghost" size="sm">
                                            <Copy size={16} />
                                        </Button>
                                    </CopyToClipboard>
                                </div>
                                <SimpleJSONEditor
                                    value={JSON.stringify(payload.content, null, 2)}
                                    readOnly={true}
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
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {testResult && (
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Test Result</h3>
                    <pre className="bg-gray-700 p-2 rounded-lg overflow-auto max-h-64 text-sm">
                        {testResult}
                    </pre>
                </div>
            )}

            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Payload</DialogTitle>
                    </DialogHeader>
                    <SimpleJSONEditor
                        value={importedPayload}
                        onChange={setImportedPayload}
                    />
                    <DialogFooter>
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
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PayloadTester;