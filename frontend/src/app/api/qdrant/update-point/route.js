
// frontend/src/app/api/qdrant/update-point/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function PUT(req) {
    try
    {
        const { collection, points } = await req.json();

        if (!collection || !points)
        {
            return new Response(JSON.stringify({ message: 'Collection and points are required.' }), {
                status: 400,
            });
        }

        const response = await qdrantClient.put(`/collections/${collection}/points/payload`, {
            points,
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error)
    {
        console.error('Error updating points:', error.response?.data || error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
        });
    }
}