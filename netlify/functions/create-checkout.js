exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SUMUP_API_KEY = process.env.SUMUP_API_KEY;
  const SUMUP_MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;
  const SITE_URL = process.env.URL || 'https://tradutor-de-gente.netlify.app';

  try {
    const { amount } = JSON.parse(event.body);

    const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUMUP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkout_reference: `tdg-${Date.now()}`,
        amount: amount || 1.99,
        currency: 'EUR',
        merchant_code: SUMUP_MERCHANT_CODE,
        description: 'Tradutor de Gente — tradução',
        hosted_checkout: {
          enabled: true
        },
        redirect_url: `${SITE_URL}/?checkout_id={checkout_id}`
      })
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
      body: JSON.stringify({
        id: data.id,
        hosted_checkout_url: data.hosted_checkout_url
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
