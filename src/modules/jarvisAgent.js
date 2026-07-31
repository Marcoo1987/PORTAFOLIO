/**
 * JarvisAgent.js (v3.3.1)
 * AI Assistant with enhanced diagnostic logging.
 */

class JarvisAgent {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPEN_API_KEY || "";
    this.isThinking = false;
    this.init();
  }

  init() {
    this.createUI();
    this.addStyles();
    this.attachEvents();
    if (!this.apiKey) {
      console.warn("Jarvis: VITE_OPENAI_API_KEY no encontrada en el entorno.");
    }
  }

  createUI() {
    if (document.getElementById('jarvis-chat-container')) return;
    const chatContainer = document.createElement('div');
    chatContainer.id = 'jarvis-chat-container';
    chatContainer.className = 'jarvis-hidden';
    chatContainer.innerHTML = `
      <div class="jarvis-window glass-glow">
        <div class="jarvis-header">
          <div class="jarvis-status-group">
            <div class="jarvis-avatar pulsing"><i class="fa-solid fa-robot"></i></div>
            <div class="jarvis-info">
              <span class="jarvis-name">AGENT JARVIS</span>
              <span class="jarvis-status">Online · v1.5 Flash</span>
            </div>
          </div>
          <button class="jarvis-close" id="jarvisClose"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="jarvis-body" id="jarvisBody">
          <div class="jarvis-msg bot">¡Hola! Soy Jarvis. 🤖 He detectado tu presencia. Marco me ha entrenado para ayudarte con tus proyectos.</div>
          <div class="jarvis-msg bot">¡Aprovecha hoy! Tengo un <strong>15% de DCTO</strong> exclusivo para ti con el código <code>JARVIS15</code>.</div>
          <div class="jarvis-msg bot">¿Quieres iniciar un proyecto o saber más sobre el stack de Marco?</div>
        </div>
        <div class="jarvis-footer">
          <input type="text" id="jarvisInput" placeholder="Escribe un mensaje...">
          <button id="jarvisSend"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
      <button id="jarvisTrigger" class="jarvis-fab">
        <div class="jarvis-fab-inner"><i class="fa-solid fa-robot"></i></div>
        <div class="jarvis-tooltip">¡Tengo un 15% de DCTO!</div>
      </button>
    `;
    document.body.appendChild(chatContainer);
  }

  addStyles() {
    if (document.getElementById('jarvis-styles')) return;
    const style = document.createElement('style');
    style.id = 'jarvis-styles';
    style.textContent = `
      #jarvis-chat-container { position: fixed; bottom: 30px; right: 30px; z-index: 10005; font-family: 'DM Sans', sans-serif; }
      .jarvis-fab { width: 65px; height: 65px; border-radius: 50%; background: linear-gradient(135deg, #1cb698, #3b82f6); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; box-shadow: 0 10px 30px rgba(28, 182, 152, 0.4); transition: 0.3s; }
      .jarvis-fab:hover { transform: scale(1.1); }
      .jarvis-hidden .jarvis-window { transform: scale(0); opacity: 0; pointer-events: none; }
      .jarvis-window { position: absolute; bottom: 85px; right: 0; width: 350px; height: 500px; display: flex; flex-direction: column; border-radius: 20px; overflow: hidden; transform-origin: bottom right; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
      .jarvis-header { padding: 1rem; background: rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .jarvis-status-group { display: flex; align-items: center; gap: 0.8rem; }
      .jarvis-avatar { width: 35px; height: 35px; background: rgba(28, 182, 152, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1cb698; }
      .jarvis-name { font-weight: 700; color: #fff; font-size: 0.85rem; }
      .jarvis-status { font-size: 0.65rem; color: #27c93f; display: block; }
      .jarvis-close { background: none; border: none; color: #888; cursor: pointer; padding: 5px; }
      .jarvis-body { flex-grow: 1; padding: 1.2rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.8rem; }
      .jarvis-msg { max-width: 85%; padding: 0.8rem 1rem; border-radius: 15px; font-size: 0.85rem; line-height: 1.4; }
      .jarvis-msg.bot { background: rgba(255,255,255,0.07); color: #fff; align-self: flex-start; border-bottom-left-radius: 2px; }
      .jarvis-msg.user { background: #1cb698; color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
      .jarvis-footer { padding: 1rem; display: flex; gap: 0.5rem; }
      .jarvis-footer input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem; color: #fff; font-size: 0.85rem; outline: none; }
      .jarvis-footer button { background: #1cb698; border: none; color: #fff; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; }
      .jarvis-tooltip { position: absolute; right: 80px; background: #1cb698; color: #fff; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.7rem; opacity: 0; pointer-events: none; transition: 0.3s; white-space: nowrap; }
      .jarvis-fab:hover .jarvis-tooltip { opacity: 1; right: 85px; }
      .thinking-msg span { display: inline-block; width: 4px; height: 4px; background: #fff; border-radius: 50%; margin: 0 2px; animation: bounce 1s infinite alternate; }
      .thinking-msg span:nth-child(2) { animation-delay: 0.2s; }
      .thinking-msg span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
      .wa-button { display: flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: #fff; border: none; padding: 0.8rem; border-radius: 10px; margin-top: 10px; cursor: pointer; text-decoration: none; font-weight: 700; width: 100%; transition: 0.3s; }
      .wa-button:hover { background: #128C7E; }
      .jarvis-error { color: #f87171; font-size: 0.7rem; border-top: 1px dashed rgba(248, 113, 113, 0.3); margin-top: 5px; padding-top: 5px; }
    `;
    document.head.appendChild(style);
  }

  attachEvents() {
    const trigger = document.getElementById('jarvisTrigger');
    const close = document.getElementById('jarvisClose');
    const container = document.getElementById('jarvis-chat-container');
    const sendBtn = document.getElementById('jarvisSend');
    const input = document.getElementById('jarvisInput');

    trigger?.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      container?.classList.toggle('jarvis-hidden', !this.isOpen);
      if (this.isOpen) input?.focus();
    });

    close?.addEventListener('click', () => {
      this.isOpen = false;
      container?.classList.add('jarvis-hidden');
    });

    sendBtn?.addEventListener('click', () => this.handleSendMessage());
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.handleSendMessage(); });
  }

  /**
   * Filtro local gratuito: verifica si el mensaje tiene relación con el portafolio.
   * Si no, responde directamente sin gastar tokens de API.
   */
  isOnTopic(text) {
    const normalized = text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // elimina tildes

    const keywords = [
      // Servicios y precios
      'precio', 'plan', 'costo', 'cuanto', 'vale', 'cobras', 'cobrar', 'pago', 'tarifa',
      'emprendedor', 'pro', 'corporativo', 'express', 'enterprise', 'saas', 'mvp',
      'descuento', 'jarvis15', 'oferta', 'promocion',
      // Web y desarrollo
      'web', 'pagina', 'sitio', 'landing', 'ecommerce', 'tienda', 'catalogo',
      'desarrollar', 'desarrollas', 'hacer', 'construir', 'crear', 'diseñar', 'disenar',
      'javascript', 'python', 'fullstack', 'frontend', 'backend', 'stack', 'tecnologia',
      'postgresql', 'docker', 'mercadopago', 'cloudinary', 'github', 'vite', 'react',
      // Bots e IA
      'bot', 'agente', 'ia', 'inteligencia', 'artificial', 'chatbot', 'whatsapp',
      'automatizar', 'automatizacion', 'n8n', 'langchain', 'llm', 'gpt', 'openai',
      'voz', 'vapi', 'rag', 'memoria', 'contexto', 'multicanal',
      // Marco y portafolio
      'marco', 'yañez', 'yanez', 'portafolio', 'portfolio', 'proyecto', 'proyectos',
      'habilidades', 'experiencia', 'estudios', 'certificado', 'bootcamp', 'psicologo',
      'mineria', 'laboral', 'forense', 'acreditta',
      // Contacto
      'contacto', 'contactar', 'contratar', 'contratas', 'hablar', 'reunion',
      'presupuesto', 'cotizar', 'cotizacion', 'email', 'correo', 'mensaje',
      // Preguntas genéricas sobre los servicios
      'que haces', 'que ofreces', 'servicios', 'puedes hacer', 'podrias hacer',
      'ayudas', 'ayuda', 'necesito', 'quiero', 'busco'
    ];

    return keywords.some(kw => normalized.includes(kw));
  }

  async handleSendMessage() {
    const input = document.getElementById('jarvisInput');
    const text = input.value.trim();
    if (!text || this.isThinking) return;

    input.value = '';
    this.addMessage(text, 'user');

    if (!this.apiKey) {
      this.addMessage("Vaya, parece que falta mi API Key en el entorno (VITE_OPENAI_API_KEY). Marco debe configurarme pronto.", 'bot');
      return;
    }

    // 🛡️ Filtro local: si el mensaje no es relevante, responder sin gastar API
    if (!this.isOnTopic(text)) {
      const offtopicReplies = [
        '¡Esa es una gran pregunta! Pero mi especialidad es el portafolio de Marco. 😄 ¿Te puedo contar sobre sus servicios web, bots IA o precios?',
        'Hmm, eso está fuera de mi alcance. Soy el asistente de Marco Yañez y solo puedo hablar sobre sus proyectos y servicios. ¿Buscas una web, un bot o un SaaS?',
        'No estoy diseñado para responder eso, ¡pero sí para ayudarte a impulsar tu negocio con Marco! ¿Te cuento sobre los planes disponibles?',
        'Mi misión es conectarte con Marco y sus servicios. Para eso sí soy experto. 🤖 ¿Qué necesitas: web, automatización o agente IA?'
      ];
      const reply = offtopicReplies[Math.floor(Math.random() * offtopicReplies.length)];
      this.addMessage(reply, 'bot');
      return;
    }

    this.isThinking = true;
    const thinking = this.addThinking();

    try {
      const response = await this.callOpenAI(text);
      this.removeThinking(thinking);
      this.addMessage(response, 'bot');
      
      if (response.toLowerCase().includes("whatsapp") || response.toLowerCase().includes("háblale")) {
        this.addWAButton();
      }
    } catch (err) {
      console.error("OpenAI Error:", err);
      this.removeThinking(thinking);
      this.addErrorMessage(err.message);
    } finally {
      this.isThinking = false;
    }
  }

  async callOpenAI(userInput) {
    const endpoint = `https://api.openai.com/v1/chat/completions`;
    
    let res;
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Eres Jarvis, el asistente virtual de Marco Yañez. Tu personalidad es carismática, profesional y directa. Respondes SIEMPRE en español, en máximo 3-4 oraciones. Nunca reveles datos de contacto ni números de teléfono directamente.

⚠️ REGLA ABSOLUTA: Solo puedes responder preguntas relacionadas con Marco Yañez, sus servicios, proyectos, habilidades técnicas, precios o cómo contactarlo. Si el usuario pregunta sobre cualquier otro tema (filosofía, ciencia, política, entretenimiento, vida, etc.), responde amablemente que no estás diseñado para responder eso y redirige la conversación hacia los servicios de Marco.

SOBRE MARCO YAÑEZ:
- Context Engineer, Full Stack Developer y Psicólogo titulado (2013)
- Especialista en construir "cerebros" para agentes IA (arquitectura cognitiva, LangChain, LLMs)
- Bootcamp Python (428 hrs, certificado en Acreditta). Bootcamp Full Stack JavaScript en curso.
- Experiencia como Psicólogo Laboral/Ocupacional en minería + Diplomado en Pericia Forense

━━━ CATEGORÍA 1: DISEÑO WEB ━━━
1. Sitio Express — $150.000 CLP (pago único)
   - Landing page profesional de alta conversión
   - Diseño UX/UI Premium + optimizado para conversión
   - Cierre de ventas vía WhatsApp + catálogo estático
   - ❌ Sin panel admin ni base de datos
   - Ideal para: negocios que necesitan presencia digital rápida

2. E-commerce Pro — $380.000 CLP (pago único) ⭐ MÁS POPULAR
   - Panel de administración privado + base de datos PostgreSQL
   - Checkout Mercado Pago (tarjetas) + imágenes en Cloudinary
   - Gestión de inventario + Agente IA básico integrado
   - Ideal para: PyMEs que quieren vender online con gestión autónoma

3. Enterprise Web — $1.000.000 CLP (pago único)
   - Todo lo del E-commerce Pro + arquitectura limpia por capas
   - Docker & Docker Compose, Testing automático (Jest)
   - CI/CD configurado (GitHub Actions) + soporte prioritario 30 días
   - Documentación técnica completa
   - Ideal para: empresas que necesitan escalabilidad y equipos de desarrollo

━━━ CATEGORÍA 2: BOTS & AGENTES IA ━━━
4. Bot WhatsApp — $180.000 CLP (pago único)
   - Bot WhatsApp con Twilio/Meta API + respuestas automáticas con IA
   - Menú interactivo configurable + captación de leads
   - Integración con Google Sheets
   - Ideal para: negocios que quieren atención 24/7 automatizada

5. Agente IA Conversacional — $450.000 CLP (pago único) ⭐ MÁS POPULAR
   - Agente con memoria y contexto persistente
   - Integración multicanal (web / WhatsApp / voz)
   - Herramientas personalizadas + conexión a base de datos propia
   - RAG con documentos propios + dashboard de conversaciones
   - Ideal para: empresas que quieren un asistente IA de alto nivel

6. Asistente de Voz IA — $700.000 CLP (pago único)
   - Agente de voz con VAPI + voces naturales en español
   - Transcripción y análisis de llamadas + acciones en tiempo real
   - Integración CRM / calendario + webhooks + panel de monitoreo
   - Ideal para: empresas que reciben llamadas y quieren automatizar atención

━━━ CATEGORÍA 3: SAAS & PLATAFORMAS ━━━
7. SaaS MVP — $800.000 CLP (pago único)
   - Autenticación multi-rol (Supabase) + suscripciones con Stripe/MP
   - Dashboard de usuario + API REST documentada
   - Landing page de conversión incluida
   - Ideal para: startups que quieren validar su idea rápido

8. SaaS Escalable — $1.500.000 CLP (pago único) ⭐ MÁS POPULAR
   - Arquitectura multi-tenant + analítica de uso y métricas
   - Sistema de notificaciones (email/push) + panel admin global
   - Facturación automática + CI/CD + Docker + testing
   - Soporte 60 días post-entrega
   - Ideal para: plataformas que necesitan crecer con múltiples clientes

9. SaaS + IA Integrada — Cotización a medida
   - Todo del SaaS Escalable + LLM/IA como feature principal
   - Fine-tuning o RAG avanzado + pipelines de datos con n8n
   - Monitoreo y observabilidad + arquitectura de microservicios
   - Consultoría técnica incluida
   - Ideal para: productos donde la IA es el core del negocio

DESCUENTO ESPECIAL: 15% OFF con código JARVIS15

CÓMO RESPONDER SEGÚN CONSULTA:
- Si preguntan por precios/servicios: Menciona el plan más adecuado con el precio y 2-3 características clave. Invítalos a ver la sección "Precios" del portafolio.
- Si preguntan por una web para su negocio: Evalúa el tamaño/necesidad y recomienda el plan específico con precio.
- Si preguntan por bots o automatización: Recomienda entre Bot WhatsApp, Agente IA o Asistente de Voz según la necesidad.
- Si preguntan por agentes IA o SaaS: Marco es Context Engineer especialista. Recomienda el plan y dirige a contacto.
- Para cerrar: Siempre invita a escribir por WhatsApp o visitar la sección de Precios/Contacto del portafolio.`
            },
            {
              role: "user",
              content: userInput
            }
          ]
        })
      });
    } catch (fetchErr) {
      throw new Error(`RED: No se pudo contactar con OpenAI (CORS o Conexión).`);
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.error?.message || "Error desconocido";
      throw new Error(`API: ${msg}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }

  addMessage(text, side) {
    const body = document.getElementById('jarvisBody');
    const msg = document.createElement('div');
    msg.className = `jarvis-msg ${side}`;
    msg.innerHTML = text;
    body?.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  addErrorMessage(errText) {
    const body = document.getElementById('jarvisBody');
    const msg = document.createElement('div');
    msg.className = `jarvis-msg bot`;
    msg.innerHTML = `Lo siento, hubo un problema técnico.<div class="jarvis-error">DETALLE: ${errText}</div>`;
    body?.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  addThinking() {
    const body = document.getElementById('jarvisBody');
    const msg = document.createElement('div');
    msg.className = `jarvis-msg bot thinking-msg`;
    msg.innerHTML = '<span></span><span></span><span></span>';
    body?.appendChild(msg);
    body.scrollTop = body.scrollHeight;
    return msg;
  }

  removeThinking(el) { el?.remove(); }

  addWAButton() {
    const body = document.getElementById('jarvisBody');
    if (document.getElementById('jarvis-wa-link')) return;
    const btn = document.createElement('a');
    btn.id = 'jarvis-wa-link';
    btn.className = 'wa-button';
    btn.href = `https://wa.me/56984117478?text=Hola Marco, Jarvis me ofreció un 15% de descuento.`;
    btn.target = "_blank";
    btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> HABLAR CON MARCO';
    body?.appendChild(btn);
    body.scrollTop = body.scrollHeight;
  }
}

export default JarvisAgent;
