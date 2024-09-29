
// frontend/src/app/api/qdrant/delete-point/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function DELETE(req) {
    try
    {
        const { collection, pointIds } = await req.json();

        if (!collection || !pointIds || !Array.isArray(pointIds))
        {
            return new Response(JSON.stringify({ message: 'Collection and pointIds (array) are required.' }), {
                status: 400,
            });
        }

        const response = await qdrantClient.delete(`/collections/${collection}/points`, {
            data: { points: pointIds },
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error)
    {
        console.error('Error deleting points:', error.response?.data || error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
        });
    }
}