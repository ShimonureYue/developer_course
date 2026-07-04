/* ============================================================
   CODE QUEST — Python en tu navegador 🐍
   Convierte cualquier <div class="py-runner"> en un editor de
   Python con su consola retro. Usa Pyodide: un "motor" de Python
   que la página descarga de internet la primera vez que corres
   código (por eso ves "Cargando Python…").

   El código inicial va dentro de:
     <script type="text/plain"> …tu código Python… </script>
   ============================================================ */

(function () {
  "use strict";

  var PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
  var PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  var CM_BASE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/";

  var pyodidePromesa = null;

  function conseguirPyodide(avisar) {
    if (!pyodidePromesa) {
      avisar("🐍 Cargando el motor de Python… (solo tarda la primera vez)");
      pyodidePromesa = CodeQuest.cargarScript(PYODIDE_URL)
        .then(function () { return loadPyodide({ indexURL: PYODIDE_BASE }); })
        .then(function (py) {
          // Hacemos que input() funcione con el cuadro de diálogo del navegador
          py.globals.set("__cq_prompt", function (mensaje) {
            var r = window.prompt(String(mensaje));
            return r === null ? "" : r;
          });
          return py.runPythonAsync(
            "import builtins\n" +
            "def __cq_input(prompt=''):\n" +
            "    respuesta = __cq_prompt(str(prompt))\n" +
            "    print(str(prompt) + str(respuesta))\n" +
            "    return respuesta\n" +
            "builtins.input = __cq_input\n"
          ).then(function () { return py; });
        })
        .catch(function (e) {
          pyodidePromesa = null; // permitir reintentar
          throw e;
        });
    }
    return pyodidePromesa;
  }

  function cargarEditorPython() {
    return CodeQuest.cargarCSS(CM_BASE + "codemirror.min.css")
      .then(function () { return CodeQuest.cargarCSS(CM_BASE + "theme/material-darker.min.css"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "codemirror.min.js"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "mode/python/python.min.js"); });
  }

  function montar(caja) {
    var titulo = caja.getAttribute("data-titulo") || "programa.py";
    var fuente = caja.querySelector("script[type='text/plain']");
    var codigoInicial = fuente ? fuente.textContent.replace(/^\n/, "") : "";
    caja.innerHTML = "";

    var marco = document.createElement("div");
    marco.className = "pg-marco";
    var barra = document.createElement("div");
    barra.className = "pg-barra";
    barra.innerHTML = '<span class="pg-titulo">🐍 ' + titulo + "</span>";

    var btnCorrer = document.createElement("button");
    btnCorrer.className = "pg-btn";
    btnCorrer.textContent = "▶ Ejecutar";
    var btnReiniciar = document.createElement("button");
    btnReiniciar.className = "pg-btn secundario";
    btnReiniciar.textContent = "🔄 Reiniciar";
    barra.appendChild(btnCorrer);
    barra.appendChild(btnReiniciar);
    marco.appendChild(barra);

    var zonaEditor = document.createElement("div");
    marco.appendChild(zonaEditor);

    var area = document.createElement("textarea");
    area.value = codigoInicial;
    area.spellcheck = false;
    area.style.cssText = "width:100%;min-height:160px;background:#0d0d22;color:#eaeaf5;border:none;padding:12px;font-family:Menlo,monospace;font-size:14px;resize:vertical;";
    zonaEditor.appendChild(area);

    var editor = { valor: function () { return area.value; }, poner: function (v) { area.value = v; } };
    cargarEditorPython().then(function () {
      var cm = CodeMirror.fromTextArea(area, {
        mode: "python",
        theme: "material-darker",
        lineNumbers: true,
        indentUnit: 4,
        viewportMargin: Infinity
      });
      editor.valor = function () { return cm.getValue(); };
      editor.poner = function (v) { cm.setValue(v); };
    }).catch(function () { /* sin internet: el textarea sigue sirviendo */ });

    var consola = document.createElement("div");
    consola.className = "consola";
    marco.appendChild(consola);
    caja.appendChild(marco);

    function linea(texto, clase) {
      var div = document.createElement("div");
      if (clase) div.className = clase;
      div.textContent = texto;
      consola.appendChild(div);
      consola.scrollTop = consola.scrollHeight;
    }

    function ejecutar() {
      consola.innerHTML = "";
      btnCorrer.disabled = true;
      btnCorrer.textContent = "⏳ …";
      conseguirPyodide(function (msg) { linea(msg, "aviso"); })
        .then(function (py) {
          consola.innerHTML = "";
          py.setStdout({ batched: function (s) { linea(s); } });
          py.setStderr({ batched: function (s) { linea(s, "error"); } });
          return py.runPythonAsync(editor.valor());
        })
        .then(function () {
          linea("✦ programa terminado ✦", "aviso");
        })
        .catch(function (err) {
          var mensaje = String(err && err.message ? err.message : err);
          // Quitamos el ruido interno de Pyodide para dejar solo el error de Python
          var util = mensaje.split("\n").filter(function (l) {
            return l.indexOf("pyodide") === -1 && l.indexOf("<exec>") === -1 || /Error|error/.test(l);
          }).join("\n");
          linea(util || mensaje, "error");
          linea("🚑 Lee la ÚLTIMA línea del error: ahí está la pista. Es normal equivocarse, ¡así aprendemos!", "aviso");
        })
        .finally(function () {
          btnCorrer.disabled = false;
          btnCorrer.textContent = "▶ Ejecutar";
        });
    }

    btnCorrer.addEventListener("click", ejecutar);
    btnReiniciar.addEventListener("click", function () {
      editor.poner(codigoInicial);
      consola.innerHTML = "";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".py-runner").forEach(montar);
  });
})();
