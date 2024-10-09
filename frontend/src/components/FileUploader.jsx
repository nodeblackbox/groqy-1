import { useState } from 'react';

export default function FileUploader({ onUpload }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('taskId', 'TASK_ID_HERE'); // Replace with actual task ID
        // Append other form data as needed

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
                // Authorization header with JWT token
                'Authorization': `Bearer YOUR_JWT_TOKEN_HERE`
            }
        });

        const data = await response.json();
        if (response.ok)
        {
            onUpload(data);
        } else
        {
            console.error(data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Upload</button>
        </form>
    );
}