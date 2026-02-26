let menuVisible = false;

// Función que muestra u oculta el menu
function mostrarOcultarMenu() {
    if (menuVisible) {
        document.getElementById("nav").classList = "";
        menuVisible = false;
    } else {
        document.getElementById("nav").classList = "responsive";
        menuVisible = true;
    }
}

function seleccionar() {
    document.getElementById("nav").classList = "";
    menuVisible = false;
}

// Animaciones de entrada (Intersection Observer)
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

// ── Typewriter effect ──────────────────────────────────────────────────────────
const BIO_TEXT = "Hola, soy Marco Yañez. Con un enfoque pragmático y orientado a resultados, me especializo en el desarrollo de aplicaciones web modernas y la creación de agentes inteligentes autónomos (IA) diseñados para optimizar procesos y escalar impacto. Mi camino en el mundo TI es una evolución constante entre el comportamiento humano y las arquitecturas Full Stack, donde combino mi pasión por el diseño UX/UI con lógica sólida en el frontend y backend. Me esfuerzo día a día por dominar las tecnologías que definen el estándar de la industria.";

function typeWriter(targetEl, cursorEl, text, speed = 28) {
    let i = 0;
    targetEl.textContent = '';
    cursorEl.style.display = 'inline';

    function step() {
        if (i < text.length) {
            targetEl.textContent += text.charAt(i);
            i++;
            setTimeout(step, speed);
        } else {
            // keep cursor blinking after finishing
        }
    }
    step();
}

// Trigger typewriter once when "sobremi" section enters viewport
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    const bioEl = document.getElementById('bioText');
    const cursorEl = document.getElementById('bioCursor');

    if (bioEl && cursorEl) {
        cursorEl.style.display = 'none'; // hide cursor until section visible
        let typed = false;

        const bioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !typed) {
                    typed = true;
                    typeWriter(bioEl, cursorEl, BIO_TEXT);
                }
            });
        }, { threshold: 0.3 });

        const sobreSection = document.getElementById('sobremi');
        if (sobreSection) bioObserver.observe(sobreSection);
    }
});