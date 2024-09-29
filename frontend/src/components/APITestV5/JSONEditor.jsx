// frontend/src/components/APITestV5/JSONEditor.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

const JSONEditor = ({ jsonStructure, setJsonStructure, handleImportJSON, handleExportJSON, validateJSON, handleSaveJSON }) => {
    const handleChange = (e) => {
        try
        {
            const parsed = JSON.parse(e.target.value);
            setJsonStructure(parsed);
        } catch (error)
        {
            // Do not update state if JSON is invalid
        }
    };

    return (
        <div className="bg-black p-6 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Dynamic JSON Builder</h2>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSaveJSON}>
                        Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleImportJSON(prompt('Paste JSON here:'))}>
                        Import
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportJSON}>
                        Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={validateJSON}>
                        Validate
                    </Button>
                </div>
            </div>
            <Input
                className="mb-4 bg-gray-800 border-gray-700 text-white"
                placeholder="Search JSON Structure..."
                value={jsonStructure ? JSON.stringify(jsonStructure, null, 2) : ''}
                onChange={handleChange}
                as="textarea"
                rows={10}
            />
        </div>
    );
};

export default JSONEditor;