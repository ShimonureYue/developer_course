/* ============================================================
   CODE QUEST — SQL en tu navegador 💾
   Convierte cualquier <div class="sql-runner"> en un editor de
   SQL conectado a una base de datos REAL (SQLite) que vive en
   tu navegador, ya cargada con jugadores de ejemplo.

   Todos los editores de la misma página comparten la base:
   si haces un INSERT en uno, el SELECT de otro lo verá. 😉

   El código inicial va dentro de:
     <script type="text/plain"> …tu consulta SQL… </script>
   ============================================================ */

(function () {
  "use strict";

  var SQLJS_BASE = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/";
  var CM_BASE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/";

  var dbPromesa = null;

  var DATOS_INICIALES =
    "CREATE TABLE jugadores (" +
    "  id INTEGER PRIMARY KEY," +
    "  nombre TEXT," +
    "  juego TEXT," +
    "  puntos INTEGER," +
    "  ciudad TEXT" +
    ");" +
    "INSERT INTO jugadores (nombre, juego, puntos, ciudad) VALUES " +
    "('Ximena', 'Snake', 480, 'Guadalajara')," +
    "('Diego', 'Space Invaders', 1250, 'CDMX')," +
    "('Valeria', 'Gato', 12, 'Monterrey')," +
    "('Santiago', 'Snake', 890, 'Puebla')," +
    "('Renata', 'Space Invaders', 2100, 'Mérida')," +
    "('Emiliano', 'Gato', 25, 'CDMX')," +
    "('Camila', 'Snake', 640, 'Tijuana')," +
    "('Leonardo', 'Space Invaders', 990, 'Guadalajara');";

  function conseguirDB(avisar) {
    if (!dbPromesa) {
      avisar("💾 Preparando tu base de datos…");
      dbPromesa = CodeQuest.cargarScript(SQLJS_BASE + "sql-wasm.min.js")
        .then(function () {
          return initSqlJs({ locateFile: function (f) { return SQLJS_BASE + f; } });
        })
        .then(function (SQL) {
          var db = new SQL.Database();
          db.run(DATOS_INICIALES);
          return db;
        })
        .catch(function (e) {
          dbPromesa = null;
          throw e;
        });
    }
    return dbPromesa;
  }

  function cargarEditorSQL() {
    return CodeQuest.cargarCSS(CM_BASE + "codemirror.min.css")
      .then(function () { return CodeQuest.cargarCSS(CM_BASE + "theme/material-darker.min.css"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "codemirror.min.js"); })
      .then(function () { return CodeQuest.cargarScript(CM_BASE + "mode/sql/sql.min.js"); });
  }

  function tablaHTML(columnas, filas) {
    var html = '<table class="tabla"><thead><tr>';
    columnas.forEach(function (c) { html += "<th>" + c + "</th>"; });
    html += "</tr></thead><tbody>";
    filas.forEach(function (fila) {
      html += "<tr>";
      fila.forEach(function (celda) {
        html += "<td>" + (celda === null ? "<span class='suave'>—</span>" : String(celda)) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    return html;
  }

  function montar(caja) {
    var titulo = caja.getAttribute("data-titulo") || "consulta.sql";
    var fuente = caja.querySelector("script[type='text/plain']");
    var codigoInicial = fuente ? fuente.textContent.replace(/^\n/, "") : "SELECT * FROM jugadores;";
    caja.innerHTML = "";

    var marco = document.createElement("div");
    marco.className = "pg-marco";
    var barra = document.createElement("div");
    barra.className = "pg-barra";
    barra.innerHTML = '<span class="pg-titulo">💾 ' + titulo + "</span>";

    var btnCorrer = document.createElement("button");
    btnCorrer.className = "pg-btn";
    btnCorrer.textContent = "▶ Consultar";
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
    area.style.cssText = "width:100%;min-height:90px;background:#0d0d22;color:#eaeaf5;border:none;padding:12px;font-family:Menlo,monospace;font-size:14px;resize:vertical;";
    zonaEditor.appendChild(area);

    var editor = { valor: function () { return area.value; }, poner: function (v) { area.value = v; } };
    cargarEditorSQL().then(function () {
      var cm = CodeMirror.fromTextArea(area, {
        mode: "text/x-sql",
        theme: "material-darker",
        lineNumbers: true,
        viewportMargin: Infinity
      });
      editor.valor = function () { return cm.getValue(); };
      editor.poner = function (v) { cm.setValue(v); };
    }).catch(function () { /* textarea de respaldo */ });

    var resultado = document.createElement("div");
    resultado.className = "sql-resultado suave";
    resultado.textContent = "▸ el resultado de tu consulta aparecerá aquí…";
    marco.appendChild(resultado);
    caja.appendChild(marco);

    function ejecutar() {
      resultado.innerHTML = "";
      conseguirDB(function (msg) { resultado.textContent = msg; })
        .then(function (db) {
          try {
            var salidas = db.exec(editor.valor());
            if (salidas.length === 0) {
              resultado.innerHTML = "<span style='color:var(--verde)'>✅ Listo. La base de datos cambió (prueba un SELECT para verla).</span>";
              return;
            }
            resultado.innerHTML = "";
            salidas.forEach(function (s) {
              resultado.innerHTML += tablaHTML(s.columns, s.values) +
                "<div class='suave' style='font-size:0.8rem'>" + s.values.length + " fila(s)</div>";
            });
          } catch (err) {
            resultado.innerHTML = "<span style='color:var(--rojo)'>❌ " + String(err.message || err) +
              "</span><div class='suave'>🚑 Revisa: ¿escribiste bien el nombre de la tabla y las columnas? ¿Cerraste las comillas?</div>";
          }
        })
        .catch(function () {
          resultado.innerHTML = "<span style='color:var(--rojo)'>❌ No se pudo descargar el motor de base de datos. ¿Hay internet?</span>";
        });
    }

    btnCorrer.addEventListener("click", ejecutar);
    btnReiniciar.addEventListener("click", function () { editor.poner(codigoInicial); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".sql-runner").forEach(montar);
  });
})();
