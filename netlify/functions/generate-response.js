exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const { context, instruction } = JSON.parse(event.body);

    const prompt = `Escreve em português europeu (PT-PT), tom natural e humano, nunca robótico. Tarefa: ${instruction}.\n\nSituação/mensagem recebida:\n"""${context}"""\n\nResponde apenas com o resultado final, direto, sem introduções tipo "aqui está" ou explicações sobre o que vais fazer.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data })
      };
    }

    const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
