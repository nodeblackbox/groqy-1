
// frontend/src/components/APITestV5/PayloadTester.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

const PayloadTester = () => {
    const [testPayload, setTestPayload] = useState('');
    const [testResult, setTestResult] = useState('');

    const handleSendPayload = async () => {
        try
        {
            const response = await fetch('/api/qdrant/create-point', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collection: 'Mind',
                    points: [
                        {
                            id: Date.now(),
                            vector: Array(384).fill(0.5), // Example vector; replace with actual data
                            payload: JSON.parse(testPayload),
                        },
                    ],
                }),
            });

            const data = await response.json();
            if (response.ok)
            {
                setTestResult('Payload sent successfully!');
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

    return (
        <div className="bg-black p-6 rounded-xl mb-4">
            <h2 className="text-2xl font-semibold mb-4">Payload Tester</h2>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1">Test Payload (JSON)</label>
                    <Input
                        value={testPayload}
                        onChange={(e) => setTestPayload(e.target.value)}
                        placeholder='e.g., {"testKey":"testValue"}'
                        as="textarea"
                        rows={3}
                    />
                </div>
                <Button onClick={handleSendPayload} className="bg-blue-600 hover:bg-blue-700">
                    Send Payload
                </Button>
                {testResult && <p className="mt-2 text-green-400">{testResult}</p>}
            </div>
        </div>
    );
};

export default PayloadTester;