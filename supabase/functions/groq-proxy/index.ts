// Koda's AI calls go through here so the Groq API key stays secret.
// Deploy as the Edge Function "groq-proxy" and set the secret GROQ_API_KEY.
// Keep "Verify JWT" on, so only logged-in users of the register can use it.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ALLOWED_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
const MAX_TOKENS = 1000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: { message: 'Use POST' } }, 405);

  const apiKey = Deno.env.get('GROQ_API_KEY');
  if (!apiKey) return json({ error: { message: 'GROQ_API_KEY secret is not set' } }, 500);

  // "Verify JWT" also lets the public anon key through, so check for a real logged-in user
  const userRes = await fetch(Deno.env.get('SUPABASE_URL') + '/auth/v1/user', {
    headers: { 'Authorization': req.headers.get('Authorization') ?? '', 'apikey': Deno.env.get('SUPABASE_ANON_KEY') ?? '' }
  });
  if (!userRes.ok) return json({ error: { message: 'Please log in to use Koda' } }, 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: { message: 'Invalid JSON' } }, 400);
  }

  // Only forward what Koda needs, so the key can't be used for anything else
  if (!ALLOWED_MODELS.includes(body.model)) return json({ error: { message: 'Model not allowed' } }, 400);
  if (!Array.isArray(body.messages) || !body.messages.length) return json({ error: { message: 'messages required' } }, 400);

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: body.model,
      messages: body.messages,
      max_tokens: Math.min(Number(body.max_tokens) || 250, MAX_TOKENS),
      temperature: body.temperature ?? 0,
      reasoning_effort: body.reasoning_effort ?? 'low',
      response_format: body.response_format ?? { type: 'json_object' }
    })
  });

  // Pass Groq's answer (including "rate limit, try again in Xs" errors) straight back
  return new Response(await res.text(), { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
