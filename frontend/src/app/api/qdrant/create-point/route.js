
// // frontend/src/app/api/qdrant/create-point/route.js
// import qdrantClient from '../../../../lib/qdrantClient';

// export async function POST(req) {
//     try
//     {
//         const { collection, points } = await req.json();

//         if (!collection || !points)
//         {
//             return new Response(JSON.stringify({ message: 'Collection and points are required.' }), {
//                 status: 400,
//             });
//         }

//         const response = await qdrantClient.put(`/collections/${collection}/points`, {
//             points,
//         });

//         return new Response(JSON.stringify(response.data), { status: 200 });
//     } catch (error)
//     {
//         console.error('Error creating points:', error.response?.data || error.message);
//         return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
//             status: 500,
//         });
//     }
// }

// frontend/src/app/api/qdrant/create-point/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function POST(req) {
    const authHeader = req.headers.get('Authorization');
    const token = process.env.QDRANT_API_TOKEN; // Set this in your .env.local

    if (!authHeader || authHeader !== `Bearer ${token}`)
    {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try
    {
        const { collection, points } = await req.json();

        if (!collection || !points)
        {
            return new Response(JSON.stringify({ message: 'Collection and points are required.' }), {
                status: 400,
            });
        }

        const response = await qdrantClient.put(`/collections/${collection}/points`, {
            points,
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error)
    {
        console.error('Error creating points:', error.response?.data || error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
        });
    }
}