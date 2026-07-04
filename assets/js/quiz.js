/* ============================================================
   CODE QUEST — Mini-quizzes ❓
   Convierte cualquier <div class="quiz"> en preguntas con
   feedback inmediato. Al responder todas bien: ¡XP!

   Estructura esperada:
   <div class="quiz" data-quiz="n3-l2" data-xp="20">
     <div class="pregunta">
       <p class="enunciado">¿…?</p>
       <button class="opcion" data-ok>respuesta correcta</button>
       <button class="opcion">respuesta incorrecta</button>
       <div class="explicacion">Por qué es así…</div>
     </div>
   </div>
   ============================================================ */

(function () {
  "use strict";

  function montar(quiz) {
    var id = quiz.getAttribute("data-quiz");
    var xp = parseInt(quiz.getAttribute("data-xp") || "20", 10);
    var preguntas = quiz.querySelectorAll(".pregunta");
    var acertadas = 0;

    if (id && CodeQuest.quizCompletado(id)) {
      marcarDominado(quiz);
    }

    preguntas.forEach(function (pregunta) {
      var opciones = pregunta.querySelectorAll(".opcion");
      var explicacion = pregunta.querySelector(".explicacion");
      var resuelta = false;

      opciones.forEach(function (opcion) {
        opcion.addEventListener("click", function () {
          if (resuelta) return;
          if (opcion.hasAttribute("data-ok")) {
            resuelta = true;
            acertadas++;
            opcion.classList.add("correcta");
            opcion.insertAdjacentText("beforeend", "  ✅");
            if (explicacion) explicacion.classList.add("visible");
            opciones.forEach(function (o) { if (o !== opcion) o.style.opacity = 0.45; });
            if (acertadas === preguntas.length) {
              if (id && CodeQuest.completarQuiz(id, xp)) {
                marcarDominado(quiz);
              } else {
                CodeQuest.toast("🧠 ¡Todas correctas!");
              }
            }
          } else {
            opcion.classList.add("incorrecta");
            setTimeout(function () { opcion.classList.remove("incorrecta"); }, 700);
            CodeQuest.toast("🤔 Casi… ¡inténtalo de nuevo!");
          }
        });
      });
    });
  }

  function marcarDominado(quiz) {
    if (quiz.querySelector(".quiz-dominado")) return;
    var sello = document.createElement("p");
    sello.className = "quiz-dominado";
    sello.style.cssText = "color:var(--verde);font-weight:800;";
    sello.textContent = "✅ Quiz dominado — ya ganaste su XP (puedes repasarlo cuando quieras)";
    quiz.insertBefore(sello, quiz.firstChild);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz").forEach(montar);
  });
})();
