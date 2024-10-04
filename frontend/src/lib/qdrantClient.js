
// frontend/src/lib/qdrantClient.js
import axios from 'axios';

// Initialize Axios instance for Qdrant
const qdrantClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333', // Replace with your Qdrant URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default qdrantClient;