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
  function crearEditor(contenedor, codigo, modo) {
    var editor = { valor: function () { return area.value; }, poner: function (v) { area.value = v; } };
    var area = document.createElement("textarea");
    area.value = codigo;
    area.spellcheck = false;
    area.style.cssText = "width:100%;min-height:160px;background:#0d0d22;color:#eaeaf5;border:none;padding:12px;font-family:Menlo,monospace;font-size:14px;resize:vertical;";
    contenedor.appendChild(area);

    cargarCodeMirror().then(function () {
      var cm = CodeMirror.fromTextArea(area, {
        mode: modo === "js" ? "javascript" : "htmlmixed",
        theme: "material-darker",
        lineNumbers: true,
        indentUnit: 2,
        tabSize: 2,
        viewportMargin: Infinity
      });
      editor.valor = function () { return cm.getValue(); };
      editor.poner = function (v) { cm.setValue(v); };
    }).catch(function () { /* sin internet: el textarea sigue funcionando */ });

    return editor;
  }

  // El código del alumno se mete a un <script>; esto evita que un
  // </script> escrito adentro rompa la página.
  function escaparScript(codigo) {
    return codigo.replace(/<\/script/gi, "<\\/script");
  }

  // Página-consola para el modo "js": muestra los console.log bonito.
  function docConsolaJS(codigoUsuario) {
    return "<!DOCTYPE html><html><head><meta charset='utf-8'><style>" +
      "body{background:#050510;color:#39ff8e;font-family:Menlo,Consolas,monospace;" +
      "font-size:14px;padding:12px;margin:0;white-space:pre-wrap;word-break:break-word;line-height:1.6}" +
      ".err{color:#ff5c7a}.res{color:#a3a3c8}" +
      "</style></head><body><script>\n" +
      "function __linea(txt, clase){var d=document.createElement('div');if(clase)d.className=clase;" +
      "d.textContent=txt;document.body.appendChild(d);}\n" +
      "console.log=function(){var a=[].slice.call(arguments).map(function(x){" +
      "return (typeof x==='object'&&x!==null)?JSON.stringify(x):String(x);});__linea(a.join(' '));};\n" +
      "console.error=function(){__linea([].slice.call(arguments).join(' '),'err');};\n" +
      "window.onerror=function(m){__linea('❌ '+m,'err');__linea('🚑 Lee el error: es una pista, no un regaño.','res');};\n" +
      "<\/script><script>\n" + escaparScript(codigoUsuario) + "\n<\/script></body></html>";
  }

  function montar(caja) {
    var modo = caja.getAttribute("data-mode") || "html";
    var titulo = caja.getAttribute("data-titulo") || (modo === "js" ? "programa.js" : "pagina.html");
    var alto = caja.getAttribute("data-alto") || "220";
    var fuente = caja.querySelector("script[type='text/plain']") || caja.querySelector("pre.codigo-inicial");
    var codigoInicial = fuente ? fuente.textContent.replace(/^\n/, "") : "";
    caja.innerHTML = "";

    var marco = document.createElement("div");
    marco.className = "pg-marco";
    var barra = document.createElement("div");
    barra.className = "pg-barra";
    barra.innerHTML = '<span class="pg-titulo">📝 ' + titulo + "</span>";

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
    var editor = crearEditor(zonaEditor, codigoInicial, modo);

    var preview = document.createElement("iframe");
    preview.className = "pg-preview" + (modo === "js" ? " oscuro" : "");
    preview.style.height = alto + "px";
    // allow-same-origin permite que los ejemplos usen localStorage (Nivel 7)
    preview.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin");
    preview.setAttribute("title", "vista previa de tu código");
    marco.appendChild(preview);
    caja.appendChild(marco);

    function ejecutar() {
      var codigo = editor.valor();
      preview.srcdoc = modo === "js" ? docConsolaJS(codigo) : codigo;
    }

    btnCorrer.addEventListener("click", ejecutar);
    btnReiniciar.addEventListener("click", function () {
      editor.poner(codigoInicial);
      ejecutar();
    });

    // Que se vea el resultado desde el principio
    if (caja.getAttribute("data-auto") !== "no") ejecutar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".playground").forEach(montar);
  });
})();
