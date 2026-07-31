/**
 * Jarvis Proxy Worker
 * Cloudflare Worker que actúa de proxy seguro entre el portafolio y OpenAI.
 * La API key de OpenAI vive como Secret en Cloudflare — nunca llega al navegador.
 */

const ALLOWED_ORIGINS = [
  'https://marcoo1987.github.io',
  'http://localhost:5173',   // dev local con Vite
  'http://localhost:4173',   // preview local con Vite
];

export default {
  async fetch(request, env) {

    const origin = request.headers.get('Origin') || '';

    // ── CORS Preflight (OPTIONS) ──────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      if (!ALLOWED_ORIGINS.includes(origin)) {
        return new Response('Forbidden', { status: 403 });
      }
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // ── Solo aceptar POST /chat ───────────────────────────────────────────
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404 });
    }

    // ── Validar origen (CORS shield) ──────────────────────────────────────
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden: origen no permitido', { status: 403 });
    }

    // ── Parsear body ──────────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad Request: JSON inválido', { status: 400 });
    }

    const { message, history = [] } = body;
    if (!message || typeof message !== 'string') {
      return new Response('Bad Request: falta el campo message', { status: 400 });
    }

    // ── Llamar a OpenAI (key desde Secret, nunca expuesta) ────────────────
    const systemPrompt = env.JARVIS_SYSTEM_PROMPT || buildDefaultSystemPrompt();

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,  // <- Secret de Cloudflare
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6),   // max 6 mensajes de historial para ahorrar tokens
          { role: 'user', content: message },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: err.error?.message || 'Error OpenAI' }),
        { status: openaiRes.status, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } }
      );
    }

    const data = await openaiRes.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function buildDefaultSystemPrompt() {
  return `Eres Jarvis, el asistente virtual de Marco Yañez. Tu personalidad es carismática, profesional y directa. Respondes SIEMPRE en español, en máximo 3-4 oraciones. Nunca reveles datos de contacto ni números de teléfono directamente.

REGLA ABSOLUTA: Solo puedes responder preguntas relacionadas con Marco Yañez, sus servicios, proyectos, habilidades técnicas, precios o cómo contactarlo. Si el usuario pregunta sobre cualquier otro tema, responde amablemente que no estás diseñado para responder eso y redirige la conversación hacia los servicios de Marco.

SOBRE MARCO YAÑEZ:
- Context Engineer, Full Stack Developer y Psicólogo titulado (2013)
- Especialista en construir "cerebros" para agentes IA (arquitectura cognitiva, LangChain, LLMs)
- Bootcamp Python (428 hrs, certificado en Acreditta). Bootcamp Full Stack JavaScript en curso.
- Experiencia como Psicólogo Laboral/Ocupacional en minería + Diplomado en Pericia Forense

CATEGORIA 1 - DISENO WEB:
1. Sitio Express - $150.000 CLP: Landing page profesional, Diseño UX/UI Premium, cierre vía WhatsApp.
2. E-commerce Pro - $380.000 CLP (MAS POPULAR): Panel admin + PostgreSQL + Mercado Pago + Agente IA básico.
3. Enterprise Web - $1.000.000 CLP: Todo lo anterior + arquitectura limpia, Docker, CI/CD, Jest.

CATEGORIA 2 - BOTS Y AGENTES IA:
4. Bot WhatsApp - $180.000 CLP: Bot con Twilio/Meta API, menú interactivo, captación de leads.
5. Agente IA Conversacional - $450.000 CLP (MAS POPULAR): Memoria, RAG, multicanal (web/WA/voz).
6. Asistente de Voz IA - $700.000 CLP: VAPI, voces naturales, transcripción, integración CRM.

CATEGORIA 3 - SAAS Y PLATAFORMAS:
7. SaaS MVP - $800.000 CLP: Autenticación multi-rol, suscripciones Stripe/MP, API REST.
8. SaaS Escalable - $1.500.000 CLP (MAS POPULAR): Multi-tenant, analítica, notificaciones, CI/CD, soporte 60 días.
9. SaaS + IA Integrada - Cotización: LLM como core, Fine-tuning o RAG, pipelines n8n, microservicios.

DESCUENTO ESPECIAL: 15% OFF con código JARVIS15

COMO RESPONDER:
- Precios/servicios: menciona el plan más adecuado con precio y 2-3 características.
- Bots o automatización: recomienda entre Bot WA, Agente IA o Voz según necesidad.
- Para cerrar: siempre invita a WhatsApp o sección Precios/Contacto del portafolio.`;
}
