exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SUMUP_API_KEY = process.env.SUMUP_API_KEY;

  try {
    const { checkout_id } = JSON.parse(event.body);

    const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkout_id}`, {
      headers: {
        'Authorization': `Bearer ${SUMUP_API_KEY}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: data.status })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
