/**
 * Cloudflare Worker — Anthropic API proxy for Exec Pressure Test
 *
 * Deploy steps:
 *   1. Add your Anthropic API key as a secret:
 *        wrangler secret put ANTHROPIC_API_KEY
 *   2. Deploy:
 *        wrangler deploy
 *   3. Copy the deployed worker URL (e.g. https://exec-pressure-test.your-subdomain.workers.dev)
 *      and paste it into exec-pressure-test.html as the value of WORKER_URL.
 *
 * The worker accepts POST requests containing a standard Anthropic
 * messages-API body (model, max_tokens, system, messages) and forwards
 * them to https://api.anthropic.com/v1/messages, injecting the API key
 * from the secret store so it never touches the browser.
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const ALLOWED_ORIGIN = '*'; // Restrict to your domain in production, e.g. 'https://yoursite.com'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const upstream = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const upstreamBody = await upstream.text();

    return new Response(upstreamBody, {
      status: upstream.status,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      },
    });
  },
};
