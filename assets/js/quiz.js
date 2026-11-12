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
      revolver(pregunta);
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

  // Revuelve las opciones cada vez que se abre la página, para que la
  // respuesta correcta no esté siempre en el mismo lugar. Si una pregunta
  // necesita su orden (por ejemplo "todas las anteriores"), ponle
  // data-orden="fijo" a su <div class="pregunta">.
  function revolver(pregunta) {
    if (pregunta.getAttribute("data-orden") === "fijo") return;
    var opciones = [].slice.call(pregunta.querySelectorAll(".opcion"));
    if (opciones.length < 3) return;
    // Cada opción deja una marca en su lugar; luego las marcas se
    // reemplazan por las opciones ya barajadas.
    var marcas = opciones.map(function (opcion) {
      var marca = document.createComment("opcion");
      opcion.parentNode.replaceChild(marca, opcion);
      return marca;
    });
    for (var i = opciones.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temporal = opciones[i];
      opciones[i] = opciones[j];
      opciones[j] = temporal;
    }
    marcas.forEach(function (marca, k) {
      marca.parentNode.replaceChild(opciones[k], marca);
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
