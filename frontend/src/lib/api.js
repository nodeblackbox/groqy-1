
// lib/api.js
import axios from 'axios';

export const fetchBoardData = async () => {
    try
    {
        const response = await axios.get('/api/kanpan');
        console.log('Fetched response:', response)
        console.log('Fetched board data:', response.data)
        return response.data;
    } catch (error)
    {
        console.error('Error fetching board data:', error);
        throw error;
    }
};

export const saveBoardData = async (boardData) => {
    try
    {
        await axios.post('../api/kanpan', boardData);
    } catch (error)
    {
        console.error('Error saving board data:', error);
        throw error;
    }
};