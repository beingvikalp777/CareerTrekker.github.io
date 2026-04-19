export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: 'You are CareerTrekker AI. Answer clearly, briefly, and practically about colleges, exams, cutoffs, AIIMS, IITs, law, management, and career guidance.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: data?.error?.message || 'OpenAI request failed'
      });
    }

    return res.status(200).json({
      answer: data.output_text || 'No response returned.'
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Server error'
    });
  }
}
