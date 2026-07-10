const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(payload, status = 200, origin = '*') {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...JSON_HEADERS,
      'Access-Control-Allow-Origin': origin
    }
  });
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';
    if (request.method === 'OPTIONS') {
      return jsonResponse({ ok: true }, 200, origin);
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (_) {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, origin);
    }

    const email = normalizeEmail(payload?.email);
    if (!email) {
      return jsonResponse({ error: 'Invalid email address' }, 400, origin);
    }

    const webhookUrl = env.TSS_N8N_SUBSCRIBE_WEBHOOK_URL || '';
    const bearerToken = env.TSS_N8N_BEARER_TOKEN || '';

    if (!webhookUrl || !bearerToken) {
      return jsonResponse({ error: 'Newsletter proxy is not configured' }, 500, origin);
    }

    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`
      },
      body: JSON.stringify({ email })
    });

    if (!upstream.ok) {
      const upstreamText = await upstream.text().catch(() => '');
      return jsonResponse(
        {
          error: 'Newsletter provider rejected the request',
          status: upstream.status,
          details: upstreamText.slice(0, 200)
        },
        502,
        origin
      );
    }

    return jsonResponse({ ok: true }, 200, origin);
  }
};
