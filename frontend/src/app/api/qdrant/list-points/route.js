
// frontend/src/app/api/qdrant/list-points/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function POST(req) {
    try
    {
        const { collection, vector = [], limit = 1000, filter = null } = await req.json();

        if (!collection)
        {
            return new Response(JSON.stringify({ message: 'Collection is required.' }), {
                status: 400,
            });
        }

        const response = await qdrantClient.post(`/collections/${collection}/points/search`, {
            vector,
            limit,
            filter,
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error)
    {
        console.error('Error listing points:', error.response?.data || error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
        });
    }
}