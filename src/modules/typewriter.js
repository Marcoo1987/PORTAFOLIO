/**
 * typewriter.js
 * Final robust version.
 */

export function initTypewriter(targetId, sourceId, speed = 20) {
  const target = document.getElementById(targetId);
  const source = document.getElementById(sourceId);
  
  if (!target || !source) {
    console.error(`Typewriter: Elementos no encontrados (${targetId}, ${sourceId})`);
    return;
  }

  // textContent captures even if hidden
  const fullText = source.textContent.trim();
  if (!fullText) {
    console.error("Typewriter: El texto fuente está vacío.");
    return;
  }

  console.log("Typewriter: Iniciando con texto:", fullText.substring(0, 20) + "...");

  let index = 0;
  target.innerHTML = ""; // Clear existing

  function type() {
    if (index < fullText.length) {
      target.innerHTML += fullText.charAt(index);
      index++;
      setTimeout(type, speed + Math.random() * 15);
    } else {
      target.classList.add('typing-done');
    }
  }

  // Use IntersectionObserver only if not already visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        type();
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(target);
}
