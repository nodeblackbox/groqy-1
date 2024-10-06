
// frontend/src/components/APITestV5/QdrantManager.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

const QdrantManager = ({ collection, setCollection }) => {
    const [pointId, setPointId] = useState('');
    const [vector, setVector] = useState('');
    const [payload, setPayload] = useState('');

    const handleCreatePoint = async () => {
        try
        {
            const response = await fetch('/api/qdrant/create-point', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collection,
                    points: [
                        {
                            id: pointId,
                            vector: vector.split(',').map(Number),
                            payload: JSON.parse(payload),
                        },
                    ],
                }),
            });

            const data = await response.json();
            if (response.ok)
            {
                toast.success('Point created successfully!');
            } else
            {
                toast.error(data.message || 'Failed to create point.');
            }
        } catch (error)
        {
            console.error('Create Point Error:', error);
            toast.error('An error occurred while creating the point.');
        }
    };

    // Similar handlers for Search, Update, Delete can be implemented here

    return (
        <div className="bg-black p-6 rounded-xl mb-4">
            <h2 className="text-2xl font-semibold mb-4">Qdrant Manager</h2>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1">Collection Name</label>
                    <Input
                        value={collection}
                        onChange={(e) => setCollection(e.target.value)}
                        placeholder="Enter Collection Name"
                    />
                </div>
                <div>
                    <label className="block mb-1">Point ID</label>
                    <Input
                        value={pointId}
                        onChange={(e) => setPointId(e.target.value)}
                        placeholder="Enter Point ID"
                    />
                </div>
                <div>
                    <label className="block mb-1">Vector (comma-separated)</label>
                    <Input
                        value={vector}
                        onChange={(e) => setVector(e.target.value)}
                        placeholder="e.g., 0.1,0.2,0.3,..."
                    />
                </div>
                <div>
                    <label className="block mb-1">Payload (JSON)</label>
                    <Input
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                        placeholder='e.g., {"key":"value"}'
                        as="textarea"
                        rows={3}
                    />
                </div>
                <Button onClick={handleCreatePoint} className="bg-green-600 hover:bg-green-700">
                    Create Point
                </Button>
            </div>
        </div>
    );
};

export default QdrantManager;