
// frontend/src/components/APITestV5/APIEndpointManager.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';

const APIEndpointManager = ({ apiEndpoints, setApiEndpoints, handleTestAPI }) => {
    const [newEndpoint, setNewEndpoint] = useState({
        name: '',
        url: '',
        method: 'GET',
        headers: '{"Content-Type": "application/json"}',
        payload: '',
    });

    const addApiEndpoint = () => {
        if (!newEndpoint.name.trim() || !newEndpoint.url.trim())
        {
            toast.error('Endpoint name and URL are required.');
            return;
        }

        try
        {
            JSON.parse(newEndpoint.headers);
            if (['POST', 'PUT'].includes(newEndpoint.method) && newEndpoint.payload)
            {
                JSON.parse(newEndpoint.payload);
            }
        } catch (error)
        {
            toast.error('Invalid JSON in headers or payload.');
            return;
        }

        const endpoint = { ...newEndpoint, id: Date.now() };
        setApiEndpoints([...apiEndpoints, endpoint]);
        setNewEndpoint({ name: '', url: '', method: 'GET', headers: '{"Content-Type": "application/json"}', payload: '' });
        toast.success('API Endpoint Added.');
    };

    const deleteApiEndpoint = (id) => {
        setApiEndpoints(apiEndpoints.filter((ep) => ep.id !== id));
        toast.success('API Endpoint Deleted.');
    };

    return (
        <div className="bg-black p-6 rounded-xl mb-4">
            <h2 className="text-2xl font-semibold mb-4">Manage API Endpoints</h2>
            <div className="flex flex-wrap space-x-4 mb-4">
                <Input
                    placeholder="Endpoint Name"
                    value={newEndpoint.name}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                />
                <Input
                    placeholder="URL"
                    value={newEndpoint.url}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                />
                <Select value={newEndpoint.method} onValueChange={(value) => setNewEndpoint({ ...newEndpoint, method: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                </Select>
                {['POST', 'PUT'].includes(newEndpoint.method) && (
                    <Input
                        placeholder="Payload (JSON)"
                        value={newEndpoint.payload}
                        onChange={(e) => setNewEndpoint({ ...newEndpoint, payload: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                        as="textarea"
                        rows={1}
                    />
                )}
                <Input
                    placeholder="Headers (JSON)"
                    value={newEndpoint.headers}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, headers: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    as="textarea"
                    rows={1}
                />
                <Button variant="ghost" onClick={addApiEndpoint}>
                    <Trash2 size={16} />
                </Button>
            </div>
            <ul className="space-y-2">
                {apiEndpoints.map((ep) => (
                    <li key={ep.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <div>
                            <p className="font-semibold">{ep.name}</p>
                            <p className="text-sm">
                                {ep.method} - {ep.url}
                            </p>
                            {ep.payload && (
                                <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(JSON.parse(ep.payload), null, 2)}</pre>
                            )}
                            {ep.headers && (
                                <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(JSON.parse(ep.headers), null, 2)}</pre>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleTestAPI(ep)}>
                                <Play size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteApiEndpoint(ep.id)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default APIEndpointManager;
