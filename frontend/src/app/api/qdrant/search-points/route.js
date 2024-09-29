
// frontend/src/app/api/qdrant/search-points/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function POST(req) {
    try
    {
        const { collection, vector, limit = 10, filter = null } = await req.json();

        if (!collection || !vector)
        {
            return new Response(JSON.stringify({ message: 'Collection and vector are required.' }), {
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
        console.error('Error searching points:', error.response?.data || error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
        });
    }
}