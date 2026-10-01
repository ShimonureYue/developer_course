/* ============================================================
   CODE QUEST — Pistas progresivas 💡
   Convierte cualquier <div class="pistas"> en un sistema de
   ayuda por capas: pista 1 (orientación) → pista 2 (concreta)
   → solución explicada. Pedir pistas NO quita XP: pedir ayuda
   es de programadores pros.

   Estructura esperada:
   <div class="pistas">
     <div class="pista"><span class="pista-titulo">PISTA 1</span> …</div>
     <div class="pista"><span class="pista-titulo">PISTA 2</span> …</div>
     <div class="pista solucion"><span class="pista-titulo">SOLUCIÓN</span> …</div>
   </div>
   ============================================================ */

(function () {
  "use strict";

  function montar(zona) {
    var pistas = zona.querySelectorAll(".pista");
    if (pistas.length === 0) return;
    var mostradas = 0;

    var boton = document.createElement("button");
    boton.className = "pg-btn";
    boton.style.background = "var(--naranja)";

    var nota = document.createElement("span");
    nota.className = "suave";
    nota.style.cssText = "font-size:0.8rem;margin-left:12px;";
    nota.textContent = "Pedir pistas es de pros 😉 (no pierdes XP)";

    function etiqueta() {
      if (mostradas >= pistas.length) return "✅ Ya viste todas las pistas";
      var siguiente = pistas[mostradas];
      return siguiente.classList.contains("solucion")
        ? "🔓 Ver la solución explicada"
        : "💡 Pedir pista (" + mostradas + "/" + (pistas.length - 1) + " usadas)";
    }

    boton.textContent = etiqueta();
    boton.addEventListener("click", function () {
      if (mostradas >= pistas.length) return;
      pistas[mostradas].classList.add("visible");
      mostradas++;
      if (typeof CodeQuest.evento === "function") CodeQuest.evento("pista");
      boton.textContent = etiqueta();
      if (mostradas >= pistas.length) boton.disabled = true;
    });

    zona.insertBefore(nota, zona.firstChild);
    zona.insertBefore(boton, zona.firstChild);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".pistas").forEach(montar);
  });
})();
