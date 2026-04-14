/**
 * JarvisAgent.js (v3.3.1)
 * AI Assistant with enhanced diagnostic logging.
 */

class JarvisAgent {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
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

SOBRE MARCO YAÑEZ:
- Context Engineer, Full Stack Developer y Psicólogo titulado (2013)
- Especialista en construir "cerebros" para agentes IA (arquitectura cognitiva, LangChain, LLMs)
- Bootcamp Python (428 hrs, certificado en Acreditta). Bootcamp Full Stack JavaScript en curso.
- Experiencia como Psicólogo Laboral/Ocupacional en minería + Diplomado en Pericia Forense

SERVICIOS Y PRECIOS:
1. PLAN EMPRENDEDOR - $200.000 CLP (pago único)
   - Catálogo estático ultrarrápido, diseño premium Dark Mode
   - Incluye: carrito de compras + cierre de ventas vía WhatsApp
   - NO incluye: base de datos, panel admin, pago con tarjetas
   - Ideal para: negocios pequeños que necesitan visibilidad rápida
   
2. PLAN PRO - $500.000 CLP (pago único) ⭐ MÁS POPULAR
   - Panel de administración privado, base de datos PostgreSQL
   - Incluye: Checkout Mercado Pago (tarjetas), Cloudinary para imágenes
   - Cierre de ventas mixto (WhatsApp + Web)
   - Ideal para: Pymes que quieren gestión autónoma y cobros online

3. PLAN CORPORATIVO - $1.000.000 CLP (pago único)
   - Todo lo del Plan Pro + Arquitectura Limpia por Capas
   - Docker/Compose, Testing automático (Jest), CI/CD configurado
   - Documentación técnica completa
   - Ideal para: empresas que necesitan escalabilidad y equipos de desarrollo

DESCUENTO ESPECIAL: 15% OFF con código JARVIS15

RESPONDE ASÍ SEGÚN LA CONSULTA:
- Si preguntan por precios/servicios: Menciona el plan más adecuado con el precio y 2-3 características clave. Invítalos a ver la pestaña "Precios" para más detalles.
- Si preguntan si pueden hacer una web para su negocio: Evalúa el tamaño/necesidad y recomienda un plan específico con precio.
- Si preguntan por agentes IA: Marco es Context Engineer especialista en esto. Dirigirlos a contactar.
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
