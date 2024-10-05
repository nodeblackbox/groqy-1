// Start Generation Here
export async function POST(req) {
    try
    {
        const { model, prompt } = await req.json();

        if (!model || !prompt)
        {
            return new Response(JSON.stringify({ error: "Model and prompt are required." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model, prompt }),
        });

        if (!response.ok)
        {
            const errorData = await response.text();
            return new Response(JSON.stringify({ error: errorData }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error)
    {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
