// src/components/FileUploader.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useNotification } from '@/components/ui/NotificationProvider';

const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const addNotification = useNotification();

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleFileUpload = async () => {
        if (files.length === 0) {
            addNotification('Please select at least one file to upload.', 'warning');
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }

        try {
            const response = await fetch('/api/upload', { // Ensure this endpoint is correctly implemented
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Files uploaded successfully!');
                setFiles([]);
                addNotification('Files uploaded successfully!', 'success');
            } else {
                setUploadStatus('Failed to upload files.');
                addNotification('Failed to upload files.', 'error');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploadStatus('An error occurred during file upload.');
            addNotification('An error occurred during file upload.', 'error');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">File Uploader</h2>
            <div className="mb-4">
                <Label htmlFor="file-upload">Select Files</Label>
                <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
            </div>
            <Button onClick={handleFileUpload} disabled={files.length === 0}>
                <Upload className="h-4 w-4 mr-1" /> Upload Files
            </Button>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
        </div>
    );
};

export default FileUploader;
