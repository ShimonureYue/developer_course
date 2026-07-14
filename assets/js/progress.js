/* ============================================================
   CODE QUEST — Sistema de progreso ("tu partida guardada")
   Guarda XP, medallas y lecciones completadas en localStorage:
   la memoria del navegador. ¡Exactamente lo que aprendes en el
   Nivel 7! Puedes leer este archivo: está escrito con lo mismo
   que te enseña el curso.
   ============================================================ */

(function () {
  "use strict";

  // ---------- El temario completo (la única fuente de verdad) ----------
  var CURSO = [
    {
      id: "n0", emoji: "🌮", color: "#ffe95c", carpeta: "nivel-0",
      titulo: "Paso 0: prepara tu equipo",
      medalla: { emoji: "🛠️", nombre: "Equipo listo" },
      lecciones: [
        { id: "n0-l1", archivo: "leccion-1.html", titulo: "Prepara tu computadora", xp: 50 },
        { id: "n0-l2", archivo: "leccion-2.html", titulo: "¿Qué es programar?", xp: 50 },
        { id: "n0-l3", archivo: "leccion-3.html", titulo: "Tu partida guardada", xp: 50 },
        { id: "n0-l4", archivo: "leccion-4.html", titulo: "Conoce tu base 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n1", emoji: "🧱", color: "#ffb86c", carpeta: "nivel-1",
      titulo: "HTML: los cimientos de la web",
      medalla: { emoji: "🧱", nombre: "Constructor web" },
      lecciones: [
        { id: "n1-l1", archivo: "leccion-1.html", titulo: "Tu primera página", xp: 50 },
        { id: "n1-l2", archivo: "leccion-2.html", titulo: "Textos con poder", xp: 50 },
        { id: "n1-l3", archivo: "leccion-3.html", titulo: "Enlaces e imágenes", xp: 50 },
        { id: "n1-l4", archivo: "leccion-4.html", titulo: "Jefe: Mi tarjeta de gamer 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n2", emoji: "🎨", color: "#ff4dd8", carpeta: "nivel-2",
      titulo: "CSS: dale estilo",
      medalla: { emoji: "🎨", nombre: "Artista del código" },
      lecciones: [
        { id: "n2-l1", archivo: "leccion-1.html", titulo: "¿Qué es CSS?", xp: 50 },
        { id: "n2-l2", archivo: "leccion-2.html", titulo: "El modelo de caja", xp: 50 },
        { id: "n2-l3", archivo: "leccion-3.html", titulo: "Acomodar cosas + magia", xp: 50 },
        { id: "n2-l4", archivo: "leccion-4.html", titulo: "Jefe: tu tarjeta con estilo 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n3", emoji: "🐍", color: "#39ff8e", carpeta: "nivel-3",
      titulo: "Python I: piensa como programador",
      medalla: { emoji: "🐍", nombre: "Encantador de serpientes" },
      lecciones: [
        { id: "n3-l1", archivo: "leccion-1.html", titulo: "Hola, Python", xp: 50 },
        { id: "n3-l2", archivo: "leccion-2.html", titulo: "Variables y constantes", xp: 50 },
        { id: "n3-l3", archivo: "leccion-3.html", titulo: "Matemáticas y decisiones", xp: 50 },
        { id: "n3-l4", archivo: "leccion-4.html", titulo: "Decisiones avanzadas + input", xp: 50 },
        { id: "n3-l5", archivo: "leccion-5.html", titulo: "Ciclos: el poder de repetir", xp: 50 },
        { id: "n3-l6", archivo: "leccion-6.html", titulo: "Listas + Jefe: El oráculo 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n4", emoji: "🧩", color: "#a78bfa", carpeta: "nivel-4",
      titulo: "Python II: funciones, tu superpoder",
      medalla: { emoji: "🧩", nombre: "Maestro de funciones" },
      lecciones: [
        { id: "n4-l1", archivo: "leccion-1.html", titulo: "¿Qué es una función?", xp: 50 },
        { id: "n4-l2", archivo: "leccion-2.html", titulo: "Parámetros: los ingredientes", xp: 50 },
        { id: "n4-l3", archivo: "leccion-3.html", titulo: "Return: el platillo que devuelve", xp: 50 },
        { id: "n4-l4", archivo: "leccion-4.html", titulo: "Jefe: dos juegos de consola 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n5", emoji: "⚡", color: "#ffe95c", carpeta: "nivel-5",
      titulo: "JavaScript: dale vida a tu página",
      medalla: { emoji: "⚡", nombre: "Domador del navegador" },
      lecciones: [
        { id: "n5-l1", archivo: "leccion-1.html", titulo: "El idioma del navegador", xp: 50 },
        { id: "n5-l2", archivo: "leccion-2.html", titulo: "Funciones y eventos", xp: 50 },
        { id: "n5-l3", archivo: "leccion-3.html", titulo: "El DOM: tocar la página", xp: 50 },
        { id: "n5-l4", archivo: "leccion-4.html", titulo: "Decisiones y ciclos en JS", xp: 50 },
        { id: "n5-l5", archivo: "leccion-5.html", titulo: "Jefe: Taco Clicker 🌮👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n6", emoji: "🎮", color: "#00e5ff", carpeta: "nivel-6",
      titulo: "Tu primer videojuego: Gato",
      medalla: { emoji: "😼", nombre: "Creador de juegos" },
      lecciones: [
        { id: "n6-l1", archivo: "leccion-1.html", titulo: "Anatomía de un videojuego", xp: 50 },
        { id: "n6-l2", archivo: "leccion-2.html", titulo: "El estado del juego", xp: 50 },
        { id: "n6-l3", archivo: "leccion-3.html", titulo: "¿Quién ganó?", xp: 50 },
        { id: "n6-l4", archivo: "leccion-4.html", titulo: "Jefe: púlelo hasta brillar 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n7", emoji: "💾", color: "#ff5c7a", carpeta: "nivel-7",
      titulo: "Datos: la memoria de tus juegos",
      medalla: { emoji: "💾", nombre: "Guardián de datos" },
      lecciones: [
        { id: "n7-l1", archivo: "leccion-1.html", titulo: "Objetos: fichas de personaje", xp: 50 },
        { id: "n7-l2", archivo: "leccion-2.html", titulo: "JSON y localStorage", xp: 50 },
        { id: "n7-l3", archivo: "leccion-3.html", titulo: "Bases de datos de verdad", xp: 50 },
        { id: "n7-l4", archivo: "leccion-4.html", titulo: "Jefe: tabla de récords 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n8", emoji: "🖌️", color: "#39ff8e", carpeta: "nivel-8",
      titulo: "Canvas: dibuja, anima y… ¡Snake!",
      medalla: { emoji: "🐍", nombre: "Animador de píxeles" },
      lecciones: [
        { id: "n8-l1", archivo: "leccion-1.html", titulo: "Tu lienzo de píxeles", xp: 50 },
        { id: "n8-l2", archivo: "leccion-2.html", titulo: "El game loop", xp: 50 },
        { id: "n8-l3", archivo: "leccion-3.html", titulo: "Tomar el control", xp: 50 },
        { id: "n8-l4", archivo: "leccion-4.html", titulo: "Snake I: la serpiente viva", xp: 50 },
        { id: "n8-l5", archivo: "leccion-5.html", titulo: "Jefe: Snake completo 👑", xp: 100, jefe: true }
      ]
    },
    {
      id: "n9", emoji: "👾", color: "#a78bfa", carpeta: "nivel-9",
      titulo: "Proyecto final: Space Invaders",
      medalla: { emoji: "👾", nombre: "GAME DEV" },
      lecciones: [
        { id: "n9-l1", archivo: "leccion-1.html", titulo: "Diseño de tu juego", xp: 50 },
        { id: "n9-l2", archivo: "leccion-2.html", titulo: "¡Fuego!", xp: 50 },
        { id: "n9-l3", archivo: "leccion-3.html", titulo: "La invasión", xp: 50 },
        { id: "n9-l4", archivo: "leccion-4.html", titulo: "Colisiones y explosiones", xp: 50 },
        { id: "n9-l5", archivo: "leccion-5.html", titulo: "Que se sienta juego", xp: 50 },
        { id: "n9-l6", archivo: "leccion-6.html", titulo: "Jefe final: tu juego completo 👑", xp: 150, jefe: true }
      ]
    },
    {
      id: "n10", emoji: "🚀", color: "#00e5ff", carpeta: "nivel-10",
      titulo: "¡Sigue jugando! Camino a Godot",
      medalla: { emoji: "🚀", nombre: "Leyenda" },
      lecciones: [
        { id: "n10-l1", archivo: "leccion-1.html", titulo: "Retos legendarios", xp: 50 },
        { id: "n10-l2", archivo: "leccion-2.html", titulo: "Godot: tu siguiente consola", xp: 50 },
        { id: "n10-l3", archivo: "leccion-3.html", titulo: "Tu camino de programador 👑", xp: 100, jefe: true }
      ]
    }
  ];

  var RANGOS = [
    { nombre: "Novato", emoji: "🥚", xp: 0 },
    { nombre: "Aprendiz", emoji: "🐣", xp: 400 },
    { nombre: "Hacker", emoji: "😎", xp: 1200 },
    { nombre: "Desarrollador", emoji: "🧑‍💻", xp: 2200 },
    { nombre: "GAME DEV", emoji: "🏆", xp: 3200 }
  ];

  var CLAVE = "codequest-partida";
  var BASE = window.CQ_BASE || "";

  // ---------- Cargar y guardar la partida ----------
  function partidaNueva() {
    return { version: 1, xp: 0, lecciones: {}, quizzes: {}, checklist: {}, extra: {} };
  }

  function cargar() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      if (!crudo) return partidaNueva();
      var p = JSON.parse(crudo);
      if (!p || typeof p !== "object" || typeof p.xp !== "number") return partidaNueva();
      p.lecciones = p.lecciones || {};
      p.quizzes = p.quizzes || {};
      p.checklist = p.checklist || {};
      p.extra = p.extra || {};
      return p;
    } catch (e) {
      return partidaNueva();
    }
  }

  function guardar(p) {
    localStorage.setItem(CLAVE, JSON.stringify(p));
  }

  var partida = cargar();

  // ---------- Consultas ----------
  function xpTotal() { return partida.xp; }

  function rangoActual() {
    var r = RANGOS[0];
    for (var i = 0; i < RANGOS.length; i++) {
      if (partida.xp >= RANGOS[i].xp) r = RANGOS[i];
    }
    return r;
  }

  function rangoSiguiente() {
    for (var i = 0; i < RANGOS.length; i++) {
      if (partida.xp < RANGOS[i].xp) return RANGOS[i];
    }
    return null;
  }

  function leccionCompletada(id) { return !!partida.lecciones[id]; }

  function nivelCompletado(nivel) {
    return nivel.lecciones.every(function (l) { return leccionCompletada(l.id); });
  }

  function progresoNivel(nivel) {
    var hechas = nivel.lecciones.filter(function (l) { return leccionCompletada(l.id); }).length;
    return { hechas: hechas, total: nivel.lecciones.length };
  }

  function buscarLeccion(id) {
    for (var i = 0; i < CURSO.length; i++) {
      for (var j = 0; j < CURSO[i].lecciones.length; j++) {
        if (CURSO[i].lecciones[j].id === id) {
          return { nivel: CURSO[i], leccion: CURSO[i].lecciones[j], i: i, j: j };
        }
      }
    }
    return null;
  }

  // La siguiente lección que NO has completado (para "▶ Continuar")
  function siguienteLeccion() {
    for (var i = 0; i < CURSO.length; i++) {
      for (var j = 0; j < CURSO[i].lecciones.length; j++) {
        var l = CURSO[i].lecciones[j];
        if (!leccionCompletada(l.id)) {
          return { nivel: CURSO[i], leccion: l, ruta: "niveles/" + CURSO[i].carpeta + "/" + l.archivo };
        }
      }
    }
    return null; // ¡terminó todo el curso!
  }

  // ---------- Acciones ----------
  function sumarXP(cantidad, motivo) {
    partida.xp += cantidad;
    guardar(partida);
    pintarHeader();
    toast("+" + cantidad + " XP" + (motivo ? " · " + motivo : ""));
  }

  function completarLeccion(id) {
    if (partida.lecciones[id]) return false; // ya estaba completada
    var info = buscarLeccion(id);
    if (!info) return false;
    partida.lecciones[id] = true;
    partida.xp += info.leccion.xp;
    guardar(partida);
    pintarHeader();
    confetti();
    var mensaje = "+" + info.leccion.xp + " XP · ¡Lección completada! 🎉";
    if (nivelCompletado(info.nivel)) {
      mensaje = "🏅 ¡Medalla: " + info.nivel.medalla.nombre + "! " + info.nivel.medalla.emoji;
      confetti(140);
    }
    toast(mensaje);
    return true;
  }

  function completarQuiz(id, xp) {
    if (partida.quizzes[id]) return false;
    partida.quizzes[id] = true;
    sumarXP(xp || 20, "quiz dominado 🧠");
    return true;
  }

  function marcarChecklist(id, hecho, xp) {
    var yaTeniaXP = !!partida.checklist[id];
    partida.checklist[id] = !!hecho;
    guardar(partida);
    if (hecho && !yaTeniaXP && xp) sumarXP(xp, "paso completado 🛠️");
  }

  function checklistHecho(id) { return !!partida.checklist[id]; }

  // ---------- Guardar / cargar partida como archivo ----------
  function exportarPartida() {
    var datos = JSON.stringify(partida, null, 2);
    var blob = new Blob([datos], { type: "application/json" });
    var enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "mi-partida-codequest.json";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    toast("💾 Partida guardada en tu carpeta de Descargas");
  }

  function importarPartida(archivo, alTerminar) {
    var lector = new FileReader();
    lector.onload = function () {
      try {
        var p = JSON.parse(lector.result);
        if (!p || typeof p.xp !== "number" || typeof p.lecciones !== "object") {
          throw new Error("formato inválido");
        }
        partida = p;
        partida.quizzes = partida.quizzes || {};
        partida.checklist = partida.checklist || {};
        partida.extra = partida.extra || {};
        guardar(partida);
        toast("📂 ¡Partida cargada! Bienvenido de vuelta 🎮");
        if (alTerminar) alTerminar(true);
        setTimeout(function () { location.reload(); }, 1200);
      } catch (e) {
        toast("❌ Ese archivo no parece una partida de Code Quest");
        if (alTerminar) alTerminar(false);
      }
    };
    lector.readAsText(archivo);
  }

  function reiniciarPartida() {
    if (!confirm("¿Seguro que quieres borrar TODO tu progreso? Esta acción no se puede deshacer.\n\nTip: primero guarda tu partida con 💾 por si te arrepientes.")) return;
    partida = partidaNueva();
    guardar(partida);
    location.reload();
  }

  // ---------- Interfaz: header con XP ----------
  function pintarHeader() {
    var barra = document.querySelector(".cq-xp-relleno");
    var texto = document.querySelector(".cq-xp-texto");
    var rango = document.querySelector(".cq-rango");
    if (!barra) return;
    var r = rangoActual();
    var sig = rangoSiguiente();
    var pct = sig ? Math.min(100, Math.round(((partida.xp - r.xp) / (sig.xp - r.xp)) * 100)) : 100;
    barra.style.width = pct + "%";
    texto.textContent = sig
      ? partida.xp + " XP · faltan " + (sig.xp - partida.xp) + " para " + sig.nombre + " " + sig.emoji
      : partida.xp + " XP · ¡rango máximo!";
    rango.textContent = r.emoji + " " + r.nombre;
  }

  function inyectarHeader() {
    if (document.querySelector(".cq-header")) { pintarHeader(); return; }
    var header = document.createElement("header");
    header.className = "cq-header";
    header.innerHTML =
      '<a class="cq-logo" href="' + BASE + 'index.html">🕹️ CODE QUEST</a>' +
      '<span class="cq-rango"></span>' +
      '<div class="cq-xp-zona"><div class="cq-xp-barra"><div class="cq-xp-relleno"></div></div>' +
      '<div class="cq-xp-texto"></div></div>' +
      '<nav class="cq-header-links">' +
      '<a href="' + BASE + 'index.html">🗺️ Mapa</a>' +
      '<a href="' + BASE + 'arcade/index.html">👾 Arcade</a>' +
      '<a href="' + BASE + 'recursos/index.html">📚 Recursos</a>' +
      '<a href="' + BASE + 'progreso.html">💾 Mi progreso</a>' +
      "</nav>";
    document.body.insertBefore(header, document.body.firstChild);
    pintarHeader();
  }

  // ---------- Interfaz: mapa de niveles (index.html) ----------
  function pintarMapa() {
    var mapa = document.getElementById("mapa-niveles");
    if (!mapa) return;
    mapa.innerHTML = "";
    var enCursoMarcado = false;
    CURSO.forEach(function (nivel, i) {
      var prog = progresoNivel(nivel);
      var tarjeta = document.createElement("a");
      tarjeta.className = "mapa-nivel";
      tarjeta.style.setProperty("--color-nivel", nivel.color);
      tarjeta.href = "niveles/" + nivel.carpeta + "/index.html";
      var estado = "⬜ Por explorar";
      if (prog.hechas === prog.total) {
        tarjeta.classList.add("completado");
        estado = "✅ ¡Completado! Medalla: " + nivel.medalla.emoji;
      } else if (prog.hechas > 0 || (!enCursoMarcado && prog.hechas === 0 && siguienteEstaEn(nivel))) {
        tarjeta.classList.add("en-curso");
        enCursoMarcado = true;
        estado = "🎯 En curso · " + prog.hechas + "/" + prog.total + " lecciones";
      }
      tarjeta.innerHTML =
        '<span class="emoji">' + nivel.emoji + "</span>" +
        '<span class="numero">NIVEL ' + i + "</span>" +
        '<div class="titulo">' + nivel.titulo + "</div>" +
        '<div class="estado">' + estado + "</div>" +
        '<div class="mini-barra"><div class="mini-relleno" style="width:' +
        Math.round((prog.hechas / prog.total) * 100) + '%"></div></div>';
      mapa.appendChild(tarjeta);
    });

    var btnContinuar = document.getElementById("btn-continuar");
    if (btnContinuar) {
      var sig = siguienteLeccion();
      if (sig) {
        btnContinuar.href = sig.ruta;
        btnContinuar.textContent = "▶ Continuar: " + sig.leccion.titulo;
      } else {
        btnContinuar.href = "progreso.html";
        btnContinuar.textContent = "🏆 ¡Terminaste el curso! Ver mi progreso";
      }
    }
  }

  function siguienteEstaEn(nivel) {
    var sig = siguienteLeccion();
    return sig && sig.nivel.id === nivel.id;
  }

  // ---------- Interfaz: botón "¡Lección completada!" ----------
  function conectarBotonCompletar() {
    var btn = document.querySelector(".btn-completar");
    if (!btn) return;
    var id = btn.getAttribute("data-leccion");
    function refrescar() {
      if (leccionCompletada(id)) {
        btn.classList.add("ya-completada");
        btn.textContent = "✅ Lección completada (puedes repasarla cuando quieras)";
      }
    }
    refrescar();
    btn.addEventListener("click", function () {
      completarLeccion(id);
      refrescar();
    });
  }

  // ---------- Interfaz: checklists persistentes ----------
  function conectarChecklists() {
    var casillas = document.querySelectorAll(".checklist input[type=checkbox][data-check]");
    casillas.forEach(function (caja) {
      var id = caja.getAttribute("data-check");
      var xp = parseInt(caja.getAttribute("data-xp") || "0", 10);
      caja.checked = checklistHecho(id);
      caja.closest("li").classList.toggle("hecho", caja.checked);
      caja.addEventListener("change", function () {
        marcarChecklist(id, caja.checked, xp);
        caja.closest("li").classList.toggle("hecho", caja.checked);
      });
    });
  }

  // ---------- Avisos y celebraciones ----------
  var toastTimer = null;
  function toast(mensaje) {
    var t = document.querySelector(".cq-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "cq-toast";
      document.body.appendChild(t);
    }
    t.textContent = mensaje;
    requestAnimationFrame(function () { t.classList.add("visible"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("visible"); }, 3200);
  }

  function confetti(cantidad) {
    var colores = ["#00e5ff", "#ff4dd8", "#39ff8e", "#ffe95c", "#a78bfa", "#ff5c7a"];
    var n = cantidad || 80;
    for (var i = 0; i < n; i++) {
      var pieza = document.createElement("div");
      pieza.className = "cq-confetti";
      var tam = 6 + Math.random() * 8;
      pieza.style.left = Math.random() * 100 + "vw";
      pieza.style.width = tam + "px";
      pieza.style.height = tam * (Math.random() > 0.5 ? 1 : 0.4) + "px";
      pieza.style.background = colores[Math.floor(Math.random() * colores.length)];
      pieza.style.animationDuration = 2.2 + Math.random() * 2 + "s";
      pieza.style.animationDelay = Math.random() * 0.6 + "s";
      document.body.appendChild(pieza);
      setTimeout(function (el) { return function () { el.remove(); }; }(pieza), 5200);
    }
  }

  // ---------- Ayudantes para cargar librerías de internet (CDN) ----------
  var cargados = {};
  function cargarScript(url) {
    if (!cargados[url]) {
      cargados[url] = new Promise(function (resolver, rechazar) {
        var s = document.createElement("script");
        s.src = url;
        s.onload = resolver;
        s.onerror = function () { rechazar(new Error("No se pudo descargar: " + url + " — ¿hay internet?")); };
        document.head.appendChild(s);
      });
    }
    return cargados[url];
  }

  function cargarCSS(url) {
    if (cargados[url]) return cargados[url];
    cargados[url] = new Promise(function (resolver) {
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = url;
      l.onload = resolver;
      l.onerror = resolver;
      document.head.appendChild(l);
    });
    return cargados[url];
  }

  // ---------- API pública ----------
  window.CodeQuest = {
    CURSO: CURSO,
    RANGOS: RANGOS,
    partida: function () { return partida; },
    xpTotal: xpTotal,
    rangoActual: rangoActual,
    rangoSiguiente: rangoSiguiente,
    leccionCompletada: leccionCompletada,
    nivelCompletado: nivelCompletado,
    progresoNivel: progresoNivel,
    siguienteLeccion: siguienteLeccion,
    completarLeccion: completarLeccion,
    completarQuiz: completarQuiz,
    quizCompletado: function (id) { return !!partida.quizzes[id]; },
    marcarChecklist: marcarChecklist,
    checklistHecho: checklistHecho,
    sumarXP: sumarXP,
    exportarPartida: exportarPartida,
    importarPartida: importarPartida,
    reiniciarPartida: reiniciarPartida,
    toast: toast,
    confetti: confetti,
    cargarScript: cargarScript,
    cargarCSS: cargarCSS
  };

  // ---------- Arranque ----------
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".estrellas")) {
      var fondo = document.createElement("div");
      fondo.className = "estrellas";
      document.body.appendChild(fondo);
    }
    inyectarHeader();
    pintarMapa();
    conectarBotonCompletar();
    conectarChecklists();
  });
})();
