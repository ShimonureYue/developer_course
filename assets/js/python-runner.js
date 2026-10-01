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

  // Segundos que puede correr un programa antes de que el guardián lo
  // detenga (sin contar el tiempo que tardas en contestar un input()).
  var LIMITE_SEGUNDOS = 5;
  // Líneas máximas en la consola (un ciclo infinito imprime millones)
  var MAX_LINEAS = 2000;

  // Funciones nuevas de progress.js, con respaldo por si el navegador
  // todavía trae guardada una versión vieja de ese archivo.
  function cq(nombre) {
    return typeof CodeQuest[nombre] === "function" ? CodeQuest[nombre] : function () { return Promise.resolve(null); };
  }

  // Lo que preparamos dentro de Python antes del primer programa:
  // - input() usa la ventanita del navegador (y "Cancelar" detiene el programa)
  // - el GUARDIÁN: revisa cada tantas líneas si el programa ya lleva
  //   demasiado tiempo corriendo; si sí, lo detiene con CicloInfinito.
  //   Solo vigila el código del alumno ("<exec>"), no el de Python.
  var PREPARAR_PYTHON = [
    "import builtins, sys, time",
    "class CicloInfinito(BaseException):  # como KeyboardInterrupt: un except Exception no la atrapa",
    "    pass",
    "class ProgramaDetenido(BaseException):",
    "    pass",
    "CicloInfinito.__module__ = 'builtins'",
    "ProgramaDetenido.__module__ = 'builtins'",
    "__cq_guardia = {'inicio': 0.0, 'pasos': 0, 'limite': " + LIMITE_SEGUNDOS + "}",
    "def __cq_paso(frame, evento, arg):",
    "    if evento == 'line':",
    "        g = __cq_guardia",
    "        g['pasos'] += 1",
    "        if g['pasos'] % 1000 == 0 and time.time() - g['inicio'] > g['limite']:",
    "            sys.settrace(None)",
    "            raise CicloInfinito('tu programa lleva más de ' + str(g['limite']) + ' segundos corriendo sin parar')",
    "    return __cq_paso",
    "def __cq_llamada(frame, evento, arg):",
    "    if frame.f_code.co_filename == '<exec>':",
    "        return __cq_paso",
    "    return None",
    "def __cq_armar_guardia():",
    "    __cq_guardia['inicio'] = time.time()",
    "    __cq_guardia['pasos'] = 0",
    "    sys.settrace(__cq_llamada)",
    "def __cq_quitar_guardia():",
    "    sys.settrace(None)",
    "def __cq_input(prompt=''):",
    "    respuesta = __cq_prompt(str(prompt))",
    "    if respuesta is None:",
    "        raise ProgramaDetenido('cancelaste la pregunta')",
    "    print(str(prompt) + str(respuesta))",
    "    __cq_guardia['inicio'] = time.time()",
    "    return respuesta",
    "builtins.input = __cq_input",
    ""
  ].join("\n");

  var pyodidePromesa = null;

  function conseguirPyodide(avisar) {
    if (!pyodidePromesa) {
      avisar("🐍 Cargando el motor de Python… (solo tarda la primera vez)");
      pyodidePromesa = CodeQuest.cargarScript(PYODIDE_URL)
        .then(function () { return loadPyodide({ indexURL: PYODIDE_BASE }); })
        .then(function (py) {
          // input() usa el cuadro de diálogo del navegador.
          // Si el alumno da "Cancelar" regresamos undefined (= None en Python)
          py.globals.set("__cq_prompt", function (mensaje) {
            var r = window.prompt(String(mensaje));
            return r === null ? undefined : r;
          });
          return py.runPythonAsync(PREPARAR_PYTHON).then(function () { return py; });
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

  // La línea del código del alumno donde ocurrió el error
  function lineaDelError(mensaje) {
    var linea = null;
    var patron = /File "<exec>", line (\d+)/g;
    var m;
    while ((m = patron.exec(mensaje))) linea = parseInt(m[1], 10);
    return linea;
  }

  function montar(caja, indice) {
    var titulo = caja.getAttribute("data-titulo") || "programa.py";
    var fuente = caja.querySelector("script[type='text/plain']");
    var codigoInicial = fuente ? fuente.textContent.replace(/^\n/, "") : "";
    caja.innerHTML = "";

    var ejercicio = caja.getAttribute("data-guardar") || "py" + indice;
    var clave = CodeQuest.claveEjercicio("py", indice, caja.getAttribute("data-guardar"));
    var guardadoPrevio = CodeQuest.codigoGuardado(clave);
    var info = { titulo: titulo, modo: "python" };
    cq("registrarInfoCodigo")(clave, info);
    cq("anclarEjercicio")(caja, ejercicio);

    var marco = document.createElement("div");
    marco.className = "pg-marco";
    var barra = document.createElement("div");
    barra.className = "pg-barra";
    barra.innerHTML = '<span class="pg-titulo">🐍 ' + titulo + "</span>" +
      '<span class="pg-guardado" aria-live="polite"></span>';
    var aviso = barra.querySelector(".pg-guardado");

    var btnCorrer = document.createElement("button");
    btnCorrer.className = "pg-btn";
    btnCorrer.textContent = "▶ Ejecutar";
    btnCorrer.title = "Ejecutar (⌘+Enter en Mac · Ctrl+Enter en Windows)";
    var btnReiniciar = document.createElement("button");
    btnReiniciar.className = "pg-btn secundario";
    btnReiniciar.textContent = "🔄 Reiniciar";
    barra.appendChild(btnCorrer);
    barra.appendChild(btnReiniciar);
    marco.appendChild(barra);

    // Autoguardado: espera a que dejes de escribir y guarda tu código
    var timerGuardar = null;
    var timerAviso = null;
    function guardarAhora() {
      clearTimeout(timerGuardar);
      timerGuardar = null;
      var actual = editor.valor();
      CodeQuest.guardarCodigo(clave, actual === codigoInicial ? null : actual, info);
      if (actual !== codigoInicial) {
        aviso.textContent = "💾 guardado";
        aviso.classList.add("visible");
        clearTimeout(timerAviso);
        timerAviso = setTimeout(function () { aviso.classList.remove("visible"); }, 1600);
      }
    }
    function programarGuardado() {
      clearTimeout(timerGuardar);
      timerGuardar = setTimeout(guardarAhora, 700);
    }
    window.addEventListener("pagehide", function () {
      if (timerGuardar) guardarAhora();
    });

    var zonaEditor = document.createElement("div");
    marco.appendChild(zonaEditor);

    var area = document.createElement("textarea");
    area.value = guardadoPrevio !== null ? guardadoPrevio : codigoInicial;
    area.spellcheck = false;
    area.style.cssText = "width:100%;min-height:160px;background:#0d0d22;color:#eaeaf5;border:none;padding:12px;font-family:Menlo,monospace;font-size:14px;resize:vertical;";
    area.addEventListener("input", programarGuardado);
    cq("atajoEjecutar")(area, correrAMano);
    zonaEditor.appendChild(area);

    var editor = { valor: function () { return area.value; }, poner: function (v) { area.value = v; } };
    cargarEditorPython().then(function () {
      var cm = CodeMirror.fromTextArea(area, {
        mode: "python",
        theme: "material-darker",
        lineNumbers: true,
        indentUnit: 4,
        viewportMargin: Infinity,
        extraKeys: { "Cmd-Enter": correrAMano, "Ctrl-Enter": correrAMano }
      });
      editor.valor = function () { return cm.getValue(); };
      editor.poner = function (v) { cm.setValue(v); };
      cm.on("change", programarGuardado);
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

    // Lo que imprime el programa del alumno. Si son miles de líneas
    // (un ciclo infinito), dejamos de pintarlas para que la página no
    // se trabe. Los avisos de Code Quest usan linea() y siempre se ven.
    var lineasMostradas = 0;
    function salida(texto, clase) {
      lineasMostradas++;
      if (lineasMostradas > MAX_LINEAS) {
        if (lineasMostradas === MAX_LINEAS + 1) {
          linea("✂️ Tu programa imprimió más de " + MAX_LINEAS + " líneas; ya no las muestro todas.", "aviso");
        }
        return;
      }
      linea(texto, clase);
    }

    function limpiarConsola() {
      consola.innerHTML = "";
      lineasMostradas = 0;
    }

    var corriendo = false;
    function ejecutar() {
      if (corriendo) return;
      corriendo = true;
      limpiarConsola();
      btnCorrer.disabled = true;
      btnCorrer.textContent = "⏳ …";
      var python = null;
      conseguirPyodide(function (msg) { linea(msg, "aviso"); })
        .then(function (py) {
          python = py;
          limpiarConsola();
          py.setStdout({ batched: function (s) { salida(s); } });
          py.setStderr({ batched: function (s) { salida(s, "error"); } });
          py.runPython("__cq_armar_guardia()");
          return py.runPythonAsync(editor.valor());
        })
        .then(function () {
          linea("✦ programa terminado ✦", "aviso");
        })
        .catch(function (err) {
          var mensaje = String(err && err.message ? err.message : err);
          var numero = lineaDelError(mensaje);
          if (/ProgramaDetenido/.test(mensaje)) {
            linea("⏹️ Cancelaste la pregunta, así que detuve tu programa. ¡Ejecútalo otra vez cuando quieras!", "aviso");
            return;
          }
          if (/CicloInfinito/.test(mensaje)) {
            cq("evento")("ciclo-infinito");
            linea("🛑 ¡El guardián detuvo tu programa! Llevaba más de " + LIMITE_SEGUNDOS +
              " segundos corriendo sin parar: seguro es un ciclo infinito.", "error");
            linea("🔎 " + (numero ? "Iba en la línea " + numero + ". " : "") +
              "Revisa que adentro de tu while algo cambie, para que la condición algún día sea False.", "aviso");
            return;
          }
          cq("evento")("error");
          // Quitamos el ruido interno de Pyodide para dejar solo el error de Python
          // (y las flechitas ^^^ que subrayan ese ruido; las que subrayan TU código se quedan)
          var anteriorFuera = false;
          var util = mensaje.split("\n").filter(function (l) {
            var queda;
            if (/^\s*\^+\s*$/.test(l)) queda = !anteriorFuera;
            else if (/CodeRunner\(|eval\(self\.code|next\(self\._gen\)|compile\(source, filename/.test(l)) queda = false;
            else queda = l.indexOf("pyodide") === -1 && l.indexOf("<exec>") === -1 || /Error|error/.test(l);
            anteriorFuera = !queda;
            return queda;
          }).join("\n");
          linea(util || mensaje, "error");
          if (numero) linea("📍 El error está en la línea " + numero + " de tu código.", "aviso");
          linea("🚑 Lee la ÚLTIMA línea del error: ahí está la pista. Es normal equivocarse, ¡así aprendemos!", "aviso");
          cq("pistaDetective")(consola, "python", mensaje).then(function () {
            consola.scrollTop = consola.scrollHeight;
          });
        })
        .finally(function () {
          if (python) {
            try { python.runPython("__cq_quitar_guardia()"); } catch (e) { /* ya estaba quitada */ }
          }
          corriendo = false;
          btnCorrer.disabled = false;
          btnCorrer.textContent = "▶ Ejecutar";
        });
    }

    function correrAMano() {
      if (corriendo) return;
      guardarAhora();
      cq("evento")("ejecutar");
      ejecutar();
    }

    btnCorrer.addEventListener("click", correrAMano);

    btnReiniciar.addEventListener("click", function () {
      if (editor.valor() === codigoInicial) {
        limpiarConsola();
        return;
      }
      CodeQuest.modalConfirmar({
        titulo: "⚠️ ¿REINICIAR EJERCICIO?",
        mensaje: "Vas a borrar TU código de este ejercicio y volverá el código original. Es como borrar un save: no se puede deshacer.",
        textoConfirmar: "🗑️ Sí, borrar mi código",
        textoCancelar: "↩ ¡No, espera!"
      }, function () {
        editor.poner(codigoInicial);
        CodeQuest.guardarCodigo(clave, null);
        limpiarConsola();
        CodeQuest.toast("🔄 Ejercicio reiniciado");
      });
    });

    // Si había código guardado, avísale al alumno que no se perdió nada
    if (guardadoPrevio !== null) {
      aviso.textContent = "💾 tu avance se restauró";
      aviso.classList.add("visible");
      timerAviso = setTimeout(function () { aviso.classList.remove("visible"); }, 3000);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".py-runner").forEach(montar);
  });
})();
