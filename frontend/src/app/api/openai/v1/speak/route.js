// 
// /api/openai/v1/speak
export async function POST(req) {
    try
    {
        const { text, model, control } = await req.json();

        if (!text || !model)
        {
            return new Response(JSON.stringify({ error: "Text and model are required." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Handle dynamic controls like stopping or interrupting conversation
        if (control === "stop")
        {
            return new Response(JSON.stringify({ message: "Conversation stopped." }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await fetch('https://api.deepgram.com/v1/speak', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, model }),
        });
        /* The comment `// where` is likely a placeholder or a marker indicating that a specific
        section of code or logic is expected to be placed there. It doesn't serve any functional
        purpose in the code snippet provided, and it seems to be a placeholder for potential
        additional code or logic that might be needed but hasn't been implemented yet. Developers
        often use such comments as reminders or placeholders for future development or as a
        reference point for where certain actions should be taken. */
        // where do i put the env for that and what do i call it and what do i call the file 

        if (!response.ok)
        {
            const errorData = await response.text();
            return new Response(JSON.stringify({ error: errorData }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const audioStream = await response.body; // This returns the audio stream
        return new Response(audioStream, {
            status: 200,
            headers: { 'Content-Type': 'audio/mpeg' },
        });

    } catch (error)
    {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
