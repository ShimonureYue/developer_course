/* ============================================================
   CODE QUEST — Playground: editor de código con vista previa
   Convierte cualquier <div class="playground"> en un editor
   con colores + botón ▶ Ejecutar.

   Modos:
     data-mode="html" → el código es una página completa y se
                        muestra en una vista previa.
     data-mode="js"   → el código es JavaScript y su salida
                        (console.log) aparece en una consola retro.

   El código inicial va dentro de:
     <script type="text/plain"> …tu código… </script>
   O bien, si el código de ejemplo contiene etiquetas </script>
   (que romperían la de arriba), va con entidades escapadas en:
     <pre class="codigo-inicial" hidden> &lt;script&gt;… </pre>
   ============================================================ */

(function () {
  "use strict";

  var CM_BASE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/";

  // Si la página se congela mientras corre un ejercicio (un ciclo
  // infinito), esta nota se queda escrita. Al volver, ese ejercicio NO
  // se ejecuta solo: así nadie queda atrapado en una página congelada.
  var CLAVE_EJECUTANDO = "codequest-ejecutando";

  // Va dentro de la vista previa: avisa a la lección cuando el
  // JavaScript del alumno truena, para mostrar el error en pantalla.
  var REPORTERO =
    "window.addEventListener('error',function(e){try{parent.postMessage(" +
    "{cqError:String(e.message||e),linea:e.lineno||0},'*')}catch(x){}});" +
    "window.addEventListener('unhandledrejection',function(e){try{var r=e.reason;" +
    "parent.postMessage({cqError:'Uncaught (in promise) '+String(r&&r.message||r),linea:0},'*')}catch(x){}});";

  // Funciones nuevas de progress.js, con respaldo por si el navegador
  // todavía trae guardada una versión vieja de ese archivo.
  function cq(nombre) {
    return typeof CodeQuest[nombre] === "function" ? CodeQuest[nombre] : function () { return Promise.resolve(null); };
  }

  function leerPendientes() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_EJECUTANDO)) || {};
    } catch (e) {
      return {};
    }
  }

  function marcarPendiente(clave, pendiente) {
    try {
      var p = leerPendientes();
      if (pendiente) p[clave] = Date.now();
      else if (p[clave]) delete p[clave];
      else return;
      if (Object.keys(p).length) localStorage.setItem(CLAVE_EJECUTANDO, JSON.stringify(p));
      else localStorage.removeItem(CLAVE_EJECUTANDO);
    } catch (e) { /* sin memoria disponible: seguimos sin la nota */ }
  }

  function cargarCodeMirror() {
    return CodeQuest.cargarCSS(CM_BASE + "codemirror.min.css")
      .then(function () { return CodeQuest.cargarCSS(CM_BASE + "theme/material-darker.min.css"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "codemirror.min.js"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "mode/xml/xml.min.js"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "mode/css/css.min.js"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "mode/javascript/javascript.min.js"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "mode/htmlmixed/htmlmixed.min.js"); });
  }

  // Crea un editor: CodeMirror si hay internet, textarea simple si no.
  // alCambiar se avisa cada vez que el alumno escribe (para autoguardar).
  // alEjecutar se llama con ⌘+Enter / Ctrl+Enter.
  function crearEditor(contenedor, codigo, modo, alCambiar, alEjecutar) {
    var editor = { valor: function () { return area.value; }, poner: function (v) { area.value = v; } };
    var area = document.createElement("textarea");
    area.value = codigo;
    area.spellcheck = false;
    area.style.cssText = "width:100%;min-height:160px;background:#0d0d22;color:#eaeaf5;border:none;padding:12px;font-family:Menlo,monospace;font-size:14px;resize:vertical;";
    contenedor.appendChild(area);
    if (alCambiar) area.addEventListener("input", alCambiar);
    cq("atajoEjecutar")(area, alEjecutar);

    cargarCodeMirror().then(function () {
      var cm = CodeMirror.fromTextArea(area, {
        mode: modo === "js" ? "javascript" : "htmlmixed",
        theme: "material-darker",
        lineNumbers: true,
        indentUnit: 2,
        tabSize: 2,
        viewportMargin: Infinity,
        extraKeys: { "Cmd-Enter": alEjecutar, "Ctrl-Enter": alEjecutar }
      });
      editor.valor = function () { return cm.getValue(); };
      editor.poner = function (v) { cm.setValue(v); };
      if (alCambiar) cm.on("change", alCambiar);
    }).catch(function () { /* sin internet: el textarea sigue funcionando */ });

    return editor;
  }

  // El código del alumno se mete a un <script>; esto evita que un
  // </script> escrito adentro rompa la página.
  function escaparScript(codigo) {
    return codigo.replace(/<\/script/gi, "<\\/script");
  }

  // ---------- El guardián de ciclos infinitos (JavaScript) ----------
  // Un while que nunca termina congela toda la pestaña. Para evitarlo,
  // antes de ejecutar metemos una llamada chiquita, __cqc(línea), al
  // principio de cada ciclo for / while / do. Esa función mira el reloj:
  // si el programa lleva más de LIMITE_CICLO milisegundos sin soltar el
  // control, lanza un error y el ciclo se detiene. El código que el
  // alumno ve y guarda NO cambia: esto solo pasa en la copia que corre.
  var LIMITE_CICLO = 3000;

  // Va dentro de la vista previa (en una sola línea, para no mover los
  // números de línea). El reloj se reinicia cada vez que el programa
  // termina su turno, y no cuenta el tiempo de un alert() o prompt().
  var GUARDIA_JS =
    "(function(){var t=0,n=0,L=" + LIMITE_CICLO + ",soltar=function(){setTimeout(function(){t=0;},0);};" +
    "try{var c=new MessageChannel();c.port1.onmessage=function(){t=0;};soltar=function(){c.port2.postMessage(0);};}catch(e){}" +
    "window.__cqc=function(l){if(t===0){t=Date.now();soltar();}" +
    "if((++n&1023)===0&&Date.now()-t>L){throw new Error('Ciclo infinito: el ciclo de la línea '+l+" +
    "' lleva más de '+(L/1000)+' segundos sin terminar');}};" +
    "['alert','prompt','confirm'].forEach(function(f){var o=window[f];if(typeof o!=='function')return;" +
    "window[f]=function(){var r=o.apply(window,arguments);if(t!==0){t=Date.now();}return r;};});" +
    "})();";

  function sintaxisValida(js) {
    try { new Function(js); return true; } catch (e) { return false; }
  }

  // Regresa el JavaScript con el guardián puesto en cada ciclo con llaves.
  // lineaBase = cuántas líneas hay antes de este código en la página.
  // Ante cualquier duda regresa el código tal cual (sin protección).
  function protegerCiclos(js, lineaBase) {
    var n = js.length;
    var salida = "";
    var i = 0;
    var linea = (lineaBase || 0) + 1;
    var puestos = 0;

    function esDeNombre(c) { return /[A-Za-z0-9_$]/.test(c || ""); }
    function saltos(texto) { return texto.split("\n").length - 1; }
    function saltarEspacios(k) {
      while (k < n && /\s/.test(js[k])) k++;
      return k;
    }
    // Si en k empieza un texto o un comentario, regresa dónde termina
    // (-1 si nunca cierra). Si no, regresa k.
    function finDeNoCodigo(k) {
      var c = js[k];
      var fin;
      if (c === '"' || c === "'" || c === "`") {
        for (fin = k + 1; fin < n; fin++) {
          if (js[fin] === "\\") { fin++; continue; }
          if (js[fin] === c) return fin + 1;
          if (js[fin] === "\n" && c !== "`") return -1;
        }
        return -1;
      }
      if (c === "/" && js[k + 1] === "/") {
        fin = js.indexOf("\n", k);
        return fin === -1 ? n : fin;
      }
      if (c === "/" && js[k + 1] === "*") {
        fin = js.indexOf("*/", k + 2);
        return fin === -1 ? -1 : fin + 2;
      }
      return k;
    }
    // k apunta a un "(": regresa la posición después de su ")" (-1 si no cierra)
    function finParentesis(k) {
      var hondo = 0;
      while (k < n) {
        var fin = finDeNoCodigo(k);
        if (fin === -1) return -1;
        if (fin > k) { k = fin; continue; }
        if (js[k] === "(") hondo++;
        else if (js[k] === ")") { hondo--; if (hondo === 0) return k + 1; }
        k++;
      }
      return -1;
    }

    while (i < n) {
      var fin = finDeNoCodigo(i);
      if (fin === -1) return js;
      if (fin > i) {
        var trozo = js.slice(i, fin);
        salida += trozo;
        linea += saltos(trozo);
        i = fin;
        continue;
      }
      var c = js[i];
      if ((c === "f" || c === "w" || c === "d") && !esDeNombre(js[i - 1]) && js[i - 1] !== ".") {
        var m = /^(for|while|do)(?![A-Za-z0-9_$])/.exec(js.substr(i, 6));
        if (m) {
          var j = i + m[1].length;
          if (m[1] !== "do") {
            j = saltarEspacios(j);
            j = js[j] === "(" ? finParentesis(j) : -2;
            if (j === -1) return js;
          }
          if (j > 0) {
            var llave = saltarEspacios(j);
            if (js[llave] === "{") {
              var ciclo = js.slice(i, llave + 1);
              salida += ciclo + "__cqc(" + linea + ");";
              linea += saltos(ciclo);
              i = llave + 1;
              puestos++;
              continue;
            }
          }
        }
      }
      if (c === "\n") linea++;
      salida += c;
      i++;
    }
    if (!puestos) return js;
    // Si el código original está bien escrito y el protegido no, algo
    // entendimos mal: mejor correr el original.
    return sintaxisValida(js) && sintaxisValida(salida) ? salida : js;
  }

  // Lo mismo para una página completa: protege cada <script> con JavaScript
  function protegerPagina(html) {
    return html.replace(/(<script\b([^>]*)>)([\s\S]*?)(<\/script\s*>)/gi, function (todo, abre, atributos, js, cierra, donde) {
      if (/\bsrc\s*=/i.test(atributos)) return todo;
      var tipo = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(atributos);
      if (tipo && !/^(text|application)\/javascript$/i.test(tipo[1])) return todo;
      var lineasAntes = html.slice(0, donde + abre.length).split("\n").length - 1;
      return abre + protegerCiclos(js, lineasAntes) + cierra;
    });
  }

  // Página-consola para el modo "js": muestra los console.log bonito.
  // Regresa la página y en qué línea empieza el código del alumno.
  function docConsolaJS(codigoUsuario) {
    var escudo = CodeQuest.ESCUDO_JS || "";
    var antes = "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
      "body{background:#050510;color:#39ff8e;font-family:Menlo,Consolas,monospace;" +
      "font-size:14px;padding:12px;margin:0;white-space:pre-wrap;word-break:break-word;line-height:1.6}" +
      ".err{color:#ff5c7a}.res{color:#a3a3c8}" +
      "</style><script>" + escudo + REPORTERO + GUARDIA_JS + "<\/script></head><body><script>\n" +
      "var __CQ_LINEAS = 0;\n" +
      "function __linea(txt, clase){var d=document.createElement('div');if(clase)d.className=clase;" +
      "d.textContent=txt;document.body.appendChild(d);}\n" +
      "function __texto(x){if(typeof x==='object'&&x!==null){try{return JSON.stringify(x);}catch(e){return String(x);}}return String(x);}\n" +
      "console.log=function(){__linea([].slice.call(arguments).map(__texto).join(' '));};\n" +
      "console.info=console.log;console.warn=console.log;\n" +
      "console.error=function(){__linea([].slice.call(arguments).map(__texto).join(' '),'err');};\n" +
      "window.onerror=function(m,s,l){__linea('❌ '+m+(l>__CQ_LINEAS?'  (línea '+(l-__CQ_LINEAS)+')':''),'err');" +
      "__linea('🚑 Lee el error: es una pista, no un regaño.','res');};\n" +
      "<\/script><script>\n";
    var desfase = antes.split("\n").length - 1;
    antes = antes.replace("var __CQ_LINEAS = 0;", "var __CQ_LINEAS = " + desfase + ";");
    return {
      html: antes + escaparScript(protegerCiclos(codigoUsuario, 0)) + "\n<\/script></body></html>",
      desfase: desfase
    };
  }

  function montar(caja, indice) {
    var modo = caja.getAttribute("data-mode") || "html";
    var titulo = caja.getAttribute("data-titulo") || (modo === "js" ? "programa.js" : "pagina.html");
    var alto = caja.getAttribute("data-alto") || "220";
    var fuente = caja.querySelector("script[type='text/plain']") || caja.querySelector("pre.codigo-inicial");
    var codigoInicial = fuente ? fuente.textContent.replace(/^\n/, "") : "";
    caja.innerHTML = "";

    var ejercicio = caja.getAttribute("data-guardar") || "pg" + indice;
    var clave = CodeQuest.claveEjercicio("pg", indice, caja.getAttribute("data-guardar"));
    var guardadoPrevio = CodeQuest.codigoGuardado(clave);
    var info = { titulo: titulo, modo: modo };
    cq("registrarInfoCodigo")(clave, info);
    cq("anclarEjercicio")(caja, ejercicio);

    var marco = document.createElement("div");
    marco.className = "pg-marco";
    var barra = document.createElement("div");
    barra.className = "pg-barra";
    barra.innerHTML = '<span class="pg-titulo">📝 ' + titulo + "</span>" +
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
    var btnGrande = null;
    if (modo === "html") {
      btnGrande = document.createElement("button");
      btnGrande.className = "pg-btn secundario";
      btnGrande.textContent = "⛶";
      btnGrande.title = "Ver en pantalla completa (Esc para salir)";
      btnGrande.setAttribute("aria-label", "Ver en pantalla completa");
      barra.appendChild(btnGrande);
    }
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

    var zonaEditor = document.createElement("div");
    marco.appendChild(zonaEditor);
    var editor = crearEditor(zonaEditor, guardadoPrevio !== null ? guardadoPrevio : codigoInicial, modo,
      programarGuardado, correrAMano);

    var preview = document.createElement("iframe");
    preview.className = "pg-preview" + (modo === "js" ? " oscuro" : "");
    preview.style.height = alto + "px";
    // allow-same-origin permite que los ejemplos usen localStorage (Nivel 7)
    // allow-popups deja que los enlaces con target="_blank" abran su pestaña (Nivel 1)
    preview.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-popups-to-escape-sandbox");
    preview.setAttribute("title", "vista previa de tu código");
    marco.appendChild(preview);

    // Aquí aparecen los errores de JavaScript (antes solo se veían en DevTools)
    var zonaError = document.createElement("div");
    zonaError.className = "pg-error";
    zonaError.hidden = true;
    marco.appendChild(zonaError);
    caja.appendChild(marco);

    // ---- Correr el código ----
    var pendiente = false;
    var desfase = 0;
    var aMano = false;
    var erroresEnEstaCorrida = 0;
    var cuentaRepetidos = null;

    preview.addEventListener("load", function () {
      if (!pendiente) return;
      // Esperamos un poquito más: un ciclo infinito también puede
      // esconderse en el primer cuadro de un juego.
      setTimeout(function () {
        pendiente = false;
        marcarPendiente(clave, false);
      }, 1500);
    });
    window.addEventListener("pagehide", function () {
      if (timerGuardar) guardarAhora();
      // Si la página se cierra normalmente, no hubo congelamiento
      if (pendiente) marcarPendiente(clave, false);
    });

    function ejecutar() {
      zonaError.hidden = true;
      zonaError.innerHTML = "";
      erroresEnEstaCorrida = 0;
      var codigo = editor.valor();
      pendiente = true;
      marcarPendiente(clave, true);
      if (modo === "js") {
        var doc = docConsolaJS(codigo);
        desfase = doc.desfase;
        preview.srcdoc = doc.html;
      } else {
        desfase = 0;
        preview.srcdoc = CodeQuest.conEscudo
          ? CodeQuest.conEscudo(protegerPagina(codigo), REPORTERO + GUARDIA_JS)
          : codigo;
      }
    }

    function correrAMano() {
      guardarAhora();
      quitarAvisoCongelado();
      aMano = true;
      cq("evento")("ejecutar");
      ejecutar();
    }

    window.addEventListener("message", function (e) {
      if (e.source !== preview.contentWindow || !e.data || typeof e.data.cqError !== "string") return;
      erroresEnEstaCorrida++;
      if (erroresEnEstaCorrida > 1) {
        // Un error dentro del game loop se repite 60 veces por segundo
        if (cuentaRepetidos) cuentaRepetidos.textContent = "(se repitió " + erroresEnEstaCorrida + " veces)";
        return;
      }
      // El guardián de ciclos avisa con su propio mensaje (ya trae la línea)
      var esCiclo = /Ciclo infinito:/.test(e.data.cqError);
      if (aMano) cq("evento")(esCiclo ? "ciclo-infinito" : "error");
      var linea = esCiclo ? 0 : e.data.linea - desfase;
      zonaError.hidden = false;
      var titulo = document.createElement("div");
      titulo.className = "pg-error-titulo";
      titulo.textContent = esCiclo
        ? "🛑 ¡El guardián detuvo tu programa!"
        : "🐞 Tu JavaScript tiene un error" + (linea > 0 ? " en la línea " + linea : "") + ":";
      var mensaje = document.createElement("code");
      mensaje.textContent = e.data.cqError;
      cuentaRepetidos = document.createElement("span");
      cuentaRepetidos.className = "suave";
      zonaError.appendChild(titulo);
      zonaError.appendChild(mensaje);
      zonaError.appendChild(document.createTextNode(" "));
      zonaError.appendChild(cuentaRepetidos);
      cq("pistaDetective")(zonaError, "js", e.data.cqError);
    });

    btnCorrer.addEventListener("click", correrAMano);

    if (btnGrande) {
      btnGrande.addEventListener("click", function () {
        var pedir = preview.requestFullscreen || preview.webkitRequestFullscreen;
        if (pedir) pedir.call(preview);
        preview.focus();
      });
    }

    btnReiniciar.addEventListener("click", function () {
      // Si no ha cambiado nada, no hay progreso que perder: reinicia y ya
      if (editor.valor() === codigoInicial) {
        editor.poner(codigoInicial);
        quitarAvisoCongelado();
        ejecutar();
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
        quitarAvisoCongelado();
        ejecutar();
        CodeQuest.toast("🔄 Ejercicio reiniciado");
      });
    });

    // Si había código guardado, avísale al alumno que no se perdió nada
    if (guardadoPrevio !== null) {
      aviso.textContent = "💾 tu avance se restauró";
      aviso.classList.add("visible");
      timerAviso = setTimeout(function () { aviso.classList.remove("visible"); }, 3000);
    }

    // ¿La última vez este ejercicio congeló la página?
    var avisoCongelado = null;
    function quitarAvisoCongelado() {
      if (avisoCongelado) {
        avisoCongelado.remove();
        avisoCongelado = null;
      }
    }
    var seCongelo = !!leerPendientes()[clave];
    if (seCongelo) {
      avisoCongelado = document.createElement("div");
      avisoCongelado.className = "pg-congelado";
      avisoCongelado.innerHTML =
        "<strong>🧊 La última vez, la página se congeló mientras corría este ejercicio.</strong> " +
        "Casi siempre es un <strong>ciclo infinito</strong>: un <code>while</code> o un <code>for</code> que nunca termina. " +
        "Por eso esta vez <strong>no lo ejecuté solo</strong>. Tu código está a salvo: revísalo y, cuando estés listo, dale ▶ Ejecutar.";
      marco.insertBefore(avisoCongelado, preview);
    }

    // Que se vea el resultado desde el principio
    if (caja.getAttribute("data-auto") !== "no" && !seCongelo) ejecutar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".playground").forEach(montar);
  });
})();
