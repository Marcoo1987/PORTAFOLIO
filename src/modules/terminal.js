/**
 * terminal.js
 * Separates AI News (Navbar) from Technical Logs (Widget) in Spanish.
 */

const AI_NEWS = [
  "Gemini 1.5 Flash: 20 veces más rápido que las versiones anteriores.",
  "OpenAI anuncia acceso anticipado a GPT-5 para desarrolladores.",
  "DeepMind logra un nuevo hito en el plegamiento de proteínas.",
  "Nuevo framework de agentes de IA reduce la latencia en un 40%.",
  "NVIDIA revela Blackwell: El chip de IA más potente del mundo.",
  "Ética de IA: Los estándares globales alcanzan consenso.",
  "Neuralink: El primer paciente humano controla un ratón con la mente.",
  "Jarvis v3.3: Ahora con capacidades de razonamiento autónomo."
];

const SYSTEM_LOGS = [
  "Inicializando Kernel... [OK]",
  "Sincronizando Nodos de Red Neuronal...",
  "Temp CPU: 42°C | Ventilador: Silencioso",
  "Detección de Fugas de Memoria: 0 bytes.",
  "Handshaking con Gemini API Cloud...",
  "Protocolo 15-DCTO: En espera.",
  "Analizando patrones de intención de visitantes...",
  "Bypassing caché para logs en tiempo real...",
  "Kernel Saludable. Up-time: 4h 22m.",
  "Túnel encriptado establecido: localhost -> Google Cloud."
];

export function initTerminal() {
  const terminalBody = document.getElementById('terminalBody');
  const navTicker = document.getElementById('navTicker');
  const visitCountEl = document.getElementById('visitCount');
  
  if (!terminalBody && !navTicker) return;

  let logIndex = 0;
  let newsIndex = 0;

  function addLog() {
    if (!terminalBody) return;
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const line = document.createElement('div');
    line.style.marginBottom = '2px';
    line.style.opacity = '0';
    line.style.transform = 'translateX(-5px)';
    line.style.transition = '0.3s ease';
    
    line.innerHTML = `<span style="color:#555">[${time}]</span> <span style="color:#1cb698">></span> ${SYSTEM_LOGS[logIndex]}`;
    
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 10);

    logIndex = (logIndex + 1) % SYSTEM_LOGS.length;
    if (terminalBody.childNodes.length > 30) {
      terminalBody.removeChild(terminalBody.firstChild);
    }
  }

  function updateNews() {
    if (!navTicker) return;
    navTicker.style.opacity = '0';
    setTimeout(() => {
      navTicker.innerHTML = `<span style="color:var(--clr-primary); font-weight:bold;">AI_NEWS >></span> ${AI_NEWS[newsIndex]}`;
      navTicker.style.opacity = '1';
      newsIndex = (newsIndex + 1) % AI_NEWS.length;
    }, 500);
  }

  if (terminalBody) {
    for(let i=0; i<3; i++) { setTimeout(addLog, i * 300); }
    setInterval(addLog, 4000);
  }
  
  if (navTicker) {
    updateNews();
    setInterval(updateNews, 8000);
  }

  let count = parseInt(localStorage.getItem('visitor_total')) || 4281;
  if (!sessionStorage.getItem('v')) {
    count += 1;
    localStorage.setItem('visitor_total', count);
    sessionStorage.setItem('v', '1');
  }
  if (visitCountEl) visitCountEl.innerText = count.toLocaleString();
}
