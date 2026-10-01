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

  // Logros: medallitas extra que NO dan XP (el XP del curso no cambia).
  // Celebran hábitos de programador: equivocarse, pedir ayuda, practicar.
  var LOGROS = [
    { id: "primer-programa", emoji: "🚀", nombre: "¡Hola, mundo!", descripcion: "Ejecuta tu primer programa." },
    { id: "primer-error", emoji: "🐞", nombre: "Bienvenido al club", descripcion: "Tu primer error. Todos los programadores los tienen: es parte del juego." },
    { id: "pista", emoji: "💡", nombre: "Pedir ayuda es de pros", descripcion: "Pide tu primera pista." },
    { id: "ciclo-infinito", emoji: "♾️", nombre: "Insignia de iniciación", descripcion: "Crea tu primer ciclo infinito (el guardián lo detuvo a tiempo)." },
    { id: "precavido", emoji: "💾", nombre: "Precavido", descripcion: "Descarga tu partida como respaldo." },
    { id: "racha-3", emoji: "🔥", nombre: "En llamas", descripcion: "Programa 3 días seguidos." },
    { id: "racha-7", emoji: "☄️", nombre: "Semana perfecta", descripcion: "Programa 7 días seguidos." },
    { id: "motor-50", emoji: "⚙️", nombre: "Motor encendido", descripcion: "Ejecuta 50 programas." },
    { id: "motor-250", emoji: "🏎️", nombre: "Imparable", descripcion: "Ejecuta 250 programas." },
    { id: "detective", emoji: "🕵️", nombre: "Detective de bugs", descripcion: "Encuentra 25 errores… y sigue intentando." },
    { id: "cerebrito", emoji: "🧠", nombre: "Cerebrito", descripcion: "Domina 10 quizzes." },
    { id: "medio-camino", emoji: "🏔️", nombre: "A medio camino", descripcion: "Completa la mitad de las lecciones del curso." }
  ];

  var CLAVE = "codequest-partida";
  // Copia de seguridad antes de "Cargar partida" o "Empezar de cero"
  var CLAVE_RESPALDO = "codequest-partida-respaldo";
  // Si algún día la partida se daña, se aparta aquí en vez de pisarla
  var CLAVE_DANADA = "codequest-partida-danada";
  var BASE = window.CQ_BASE || "";

  // ---------- Cargar y guardar la partida ----------
  function partidaNueva() {
    return { version: 1, xp: 0, lecciones: {}, quizzes: {}, checklist: {}, extra: {} };
  }

  // Revisa que algo parezca partida y completa los cajones que falten
  function normalizar(p) {
    if (!p || typeof p !== "object" || typeof p.xp !== "number") return null;
    p.lecciones = p.lecciones || {};
    p.quizzes = p.quizzes || {};
    p.checklist = p.checklist || {};
    p.extra = p.extra || {};
    return p;
  }

  function cargar() {
    var crudo;
    try {
      crudo = localStorage.getItem(CLAVE);
    } catch (e) {
      return partidaNueva();
    }
    if (!crudo) return partidaNueva();
    try {
      var p = normalizar(JSON.parse(crudo));
      if (p) return p;
    } catch (e) { /* abajo la apartamos */ }
    try { localStorage.setItem(CLAVE_DANADA, crudo); } catch (e) { /* sin espacio: ni modo */ }
    return partidaNueva();
  }

  // Otra pestaña pudo haber guardado algo mientras tanto. Antes de cambiar
  // la partida leemos la versión más nueva: es como revisar la libreta
  // antes de escribir, en vez de usar una fotocopia vieja.
  function releer() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      if (!crudo) return; // si alguien la borró, la copia en memoria la repone
      var p = normalizar(JSON.parse(crudo));
      if (p) partida = p;
    } catch (e) { /* nos quedamos con la copia en memoria */ }
  }

  var avisoSinGuardar = false;
  function guardar(p) {
    var datos = JSON.stringify(p);
    try {
      localStorage.setItem(CLAVE, datos);
      return true;
    } catch (e) {
      // ¿Se llenó la memoria? Las copias de seguridad ocupan lugar:
      // la partida de hoy vale más, así que las soltamos y reintentamos.
      try {
        localStorage.removeItem(CLAVE_RESPALDO);
        localStorage.removeItem(CLAVE_DANADA);
        localStorage.setItem(CLAVE, datos);
        return true;
      } catch (e2) { /* de plano no se puede guardar */ }
      if (!avisoSinGuardar && document.body) {
        avisoSinGuardar = true;
        toast("⚠️ Este navegador no me deja guardar. Descarga tu partida en 💾 Mi progreso");
      }
      return false;
    }
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
    releer();
    partida.xp += cantidad;
    guardar(partida);
    pintarHeader();
    toast("+" + cantidad + " XP" + (motivo ? " · " + motivo : ""));
  }

  function completarLeccion(id) {
    releer();
    if (partida.lecciones[id]) return false; // ya estaba completada
    var info = buscarLeccion(id);
    if (!info) return false;
    partida.lecciones[id] = true;
    partida.xp += info.leccion.xp;
    var subioRacha = actualizarRacha();
    var nuevos = revisarLogros();
    guardar(partida);
    pintarHeader();
    confetti();
    var mensaje = "+" + info.leccion.xp + " XP · ¡Lección completada! 🎉";
    var medalla = nivelCompletado(info.nivel);
    if (medalla) {
      mensaje = "🏅 ¡Medalla: " + info.nivel.medalla.nombre + "! " + info.nivel.medalla.emoji;
      confetti(140);
    }
    toast(mensaje);
    celebrar(subioRacha, nuevos);
    // Al ganar una medalla es buen momento para respaldar la partida
    if (medalla) setTimeout(function () { sugerirRespaldo(info.nivel); }, 2600);
    return true;
  }

  function completarQuiz(id, xp) {
    releer();
    if (partida.quizzes[id]) return false;
    partida.quizzes[id] = true;
    var cantidad = xp || 20;
    partida.xp += cantidad;
    var subioRacha = actualizarRacha();
    var nuevos = revisarLogros();
    guardar(partida);
    pintarHeader();
    toast("+" + cantidad + " XP · quiz dominado 🧠");
    celebrar(subioRacha, nuevos);
    return true;
  }

  function marcarChecklist(id, hecho, xp) {
    releer();
    // El XP de cada paso se da UNA vez (desmarcar y volver a marcar no suma de nuevo)
    var pagados = partida.extra.checklistXP || (partida.extra.checklistXP = {});
    var yaTeniaXP = !!partida.checklist[id] || !!pagados[id];
    partida.checklist[id] = !!hecho;
    var ganaXP = hecho && !yaTeniaXP && xp;
    if (ganaXP) {
      partida.xp += xp;
      pagados[id] = true;
    }
    var subioRacha = hecho ? actualizarRacha() : false;
    var nuevos = revisarLogros();
    guardar(partida);
    if (ganaXP) {
      pintarHeader();
      toast("+" + xp + " XP · paso completado 🛠️");
    }
    celebrar(subioRacha, nuevos);
  }

  function checklistHecho(id) { return !!partida.checklist[id]; }

  // ---------- Racha de días seguidos 🔥 ----------
  function dosDigitos(n) { return (n < 10 ? "0" : "") + n; }

  function hoyTexto() {
    var d = new Date();
    return d.getFullYear() + "-" + dosDigitos(d.getMonth() + 1) + "-" + dosDigitos(d.getDate());
  }

  function diasEntre(a, b) {
    var pa = a.split("-"), pb = b.split("-");
    return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
  }

  // Cuenta el día de hoy en la racha. Regresa true si la racha subió.
  function actualizarRacha() {
    var r = partida.extra.racha || (partida.extra.racha = { dias: 0, ultimoDia: null, mejor: 0 });
    var hoy = hoyTexto();
    if (r.ultimoDia === hoy) return false;
    r.dias = r.ultimoDia && diasEntre(r.ultimoDia, hoy) === 1 ? r.dias + 1 : 1;
    r.ultimoDia = hoy;
    r.mejor = Math.max(r.mejor || 0, r.dias);
    return true;
  }

  // La racha sigue viva si programaste hoy o ayer
  function rachaActual() {
    var r = partida.extra.racha;
    if (!r || !r.ultimoDia) return 0;
    return diasEntre(r.ultimoDia, hoyTexto()) <= 1 ? r.dias : 0;
  }

  // ---------- Logros 🏆 ----------
  function estadisticas() {
    var s = partida.extra.stats || (partida.extra.stats = {});
    s.ejecuciones = s.ejecuciones || 0;
    s.errores = s.errores || 0;
    s.pistas = s.pistas || 0;
    s.ciclos = s.ciclos || 0;
    return s;
  }

  function totalLecciones() {
    return CURSO.reduce(function (suma, n) { return suma + n.lecciones.length; }, 0);
  }

  function logroCumplido(id) {
    var s = estadisticas();
    var r = partida.extra.racha || {};
    switch (id) {
      case "primer-programa": return s.ejecuciones >= 1;
      case "primer-error": return s.errores >= 1;
      case "pista": return s.pistas >= 1;
      case "ciclo-infinito": return s.ciclos >= 1;
      case "precavido": return !!partida.extra.ultimoRespaldo;
      case "racha-3": return (r.mejor || 0) >= 3;
      case "racha-7": return (r.mejor || 0) >= 7;
      case "motor-50": return s.ejecuciones >= 50;
      case "motor-250": return s.ejecuciones >= 250;
      case "detective": return s.errores >= 25;
      case "cerebrito": return Object.keys(partida.quizzes).length >= 10;
      case "medio-camino": return Object.keys(partida.lecciones).length >= Math.ceil(totalLecciones() / 2);
    }
    return false;
  }

  // Desbloquea los logros recién cumplidos (sin guardar). Regresa los nuevos.
  function revisarLogros() {
    var ganados = partida.extra.logros || (partida.extra.logros = {});
    var nuevos = [];
    LOGROS.forEach(function (l) {
      if (!ganados[l.id] && logroCumplido(l.id)) {
        ganados[l.id] = Date.now();
        nuevos.push(l);
      }
    });
    return nuevos;
  }

  function logroGanado(id) {
    return !!(partida.extra.logros && partida.extra.logros[id]);
  }

  // Algo pasó en un ejercicio: "ejecutar", "error", "pista" o "ciclo-infinito"
  function evento(tipo) {
    releer();
    var s = estadisticas();
    if (tipo === "ejecutar") s.ejecuciones++;
    else if (tipo === "error") s.errores++;
    else if (tipo === "pista") s.pistas++;
    else if (tipo === "ciclo-infinito") { s.ciclos++; s.errores++; }
    else return;
    var subioRacha = tipo === "error" ? false : actualizarRacha();
    var nuevos = revisarLogros();
    guardar(partida);
    if (subioRacha) pintarHeader();
    celebrar(subioRacha, nuevos);
  }

  function celebrar(subioRacha, nuevos) {
    var dias = rachaActual();
    if (subioRacha && dias >= 2) {
      anunciar({ arriba: "🔥 RACHA", emoji: "🔥", texto: "¡" + dias + " días seguidos programando!" });
    }
    (nuevos || []).forEach(function (l) {
      anunciar({ arriba: "🏆 LOGRO DESBLOQUEADO", emoji: l.emoji, texto: l.nombre, enlace: true });
    });
  }

  // Avisos tipo "logro de consola" en la esquina, uno tras otro
  var filaAnuncios = [];
  var anunciando = false;
  function anunciar(anuncio) {
    filaAnuncios.push(anuncio);
    if (!anunciando) siguienteAnuncio();
  }

  function siguienteAnuncio() {
    var a = filaAnuncios.shift();
    if (!a || !document.body) { anunciando = false; return; }
    anunciando = true;
    var caja = document.createElement(a.enlace ? "a" : "div");
    caja.className = "cq-logro";
    if (a.enlace) caja.href = BASE + "progreso.html#logros";
    caja.innerHTML = '<span class="cq-logro-emoji"></span><span><span class="cq-logro-arriba"></span>' +
      '<span class="cq-logro-texto"></span></span>';
    caja.querySelector(".cq-logro-emoji").textContent = a.emoji;
    caja.querySelector(".cq-logro-arriba").textContent = a.arriba;
    caja.querySelector(".cq-logro-texto").textContent = a.texto;
    document.body.appendChild(caja);
    requestAnimationFrame(function () { caja.classList.add("visible"); });
    setTimeout(function () {
      caja.classList.remove("visible");
      setTimeout(function () { caja.remove(); siguienteAnuncio(); }, 400);
    }, 3600);
  }

  // Logros que se ganan con lo que ya tenías (por ejemplo, quizzes viejos)
  function revisarLogrosAlEntrar() {
    if (!partida.extra.logros && Object.keys(partida.lecciones).length === 0) return;
    releer();
    var nuevos = revisarLogros();
    if (nuevos.length) {
      guardar(partida);
      celebrar(false, nuevos);
    }
  }

  // ---------- Guardar / cargar partida como archivo ----------
  function exportarPartida() {
    releer();
    partida.extra.ultimoRespaldo = Date.now();
    partida.extra.leccionesAlRespaldar = Object.keys(partida.lecciones).length;
    var nuevos = revisarLogros();
    guardar(partida);
    var datos = JSON.stringify(partida, null, 2);
    var blob = new Blob([datos], { type: "application/json" });
    var enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "mi-partida-codequest.json";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    toast("💾 Partida guardada en tu carpeta de Descargas");
    var recordatorio = document.querySelector(".cq-recordatorio");
    if (recordatorio) recordatorio.remove();
    celebrar(false, nuevos);
  }

  function resumenPartida(p) {
    return p.xp + " XP y " + Object.keys(p.lecciones || {}).length + " lecciones completadas";
  }

  function tieneAvance(p) {
    return p.xp > 0 || Object.keys(p.lecciones).length > 0 ||
      Object.keys((p.extra && p.extra.codigo) || {}).length > 0;
  }

  function importarPartida(archivo, alTerminar) {
    var lector = new FileReader();
    lector.onload = function () {
      var p;
      try {
        p = JSON.parse(lector.result);
        if (!p || typeof p.xp !== "number" || typeof p.lecciones !== "object") {
          throw new Error("formato inválido");
        }
        normalizar(p);
      } catch (e) {
        toast("❌ Ese archivo no parece una partida de Code Quest");
        if (alTerminar) alTerminar(false);
        return;
      }
      function cargarla() {
        guardarRespaldo("antes de cargar una partida desde archivo");
        partida = p;
        guardar(partida);
        toast("📂 ¡Partida cargada! Bienvenido de vuelta 🎮");
        if (alTerminar) alTerminar(true);
        setTimeout(function () { location.reload(); }, 1200);
      }
      releer();
      if (!tieneAvance(partida)) { cargarla(); return; }
      modalConfirmar({
        titulo: "📂 ¿CARGAR ESTA PARTIDA?",
        mensaje: "El archivo trae " + resumenPartida(p) + ".\nTu partida de ahora tiene " + resumenPartida(partida) +
          " y será reemplazada.\n\nNo te preocupes: guardaré una copia de respaldo y podrás recuperarla desde 💾 Mi progreso.",
        textoConfirmar: "📂 Sí, cargarla",
        textoCancelar: "↩ Cancelar",
        alCancelar: function () { if (alTerminar) alTerminar(false); }
      }, cargarla);
    };
    lector.readAsText(archivo);
  }

  function reiniciarPartida() {
    modalConfirmar({
      titulo: "⚠️ ¿BORRAR TU PARTIDA?",
      mensaje: "Vas a borrar TODO: tu XP, tus medallas y el código que escribiste en los ejercicios. Es como borrar un save de un videojuego.\n\nPor si te arrepientes, guardaré UNA copia de respaldo que puedes recuperar desde esta misma página.",
      textoConfirmar: "🗑️ Sí, borrar todo",
      textoCancelar: "↩ ¡No, espera!"
    }, function () {
      guardarRespaldo("antes de empezar de cero");
      partida = partidaNueva();
      guardar(partida);
      location.reload();
    });
  }

  // ---------- Copia de respaldo (para deshacer) ----------
  function guardarRespaldo(motivo) {
    try {
      var crudo = localStorage.getItem(CLAVE);
      var p = crudo && normalizar(JSON.parse(crudo));
      if (!p || !tieneAvance(p)) return;
      localStorage.setItem(CLAVE_RESPALDO, JSON.stringify({ fecha: Date.now(), motivo: motivo, partida: p }));
    } catch (e) { /* el respaldo es un extra: si no cabe, seguimos */ }
  }

  function leerRespaldo() {
    try {
      var r = JSON.parse(localStorage.getItem(CLAVE_RESPALDO));
      if (r && normalizar(r.partida)) return r;
    } catch (e) { /* sin respaldo */ }
    return null;
  }

  function recuperarRespaldo() {
    var r = leerRespaldo();
    if (!r) {
      toast("No hay ninguna partida de respaldo");
      return;
    }
    modalConfirmar({
      titulo: "↩ ¿RECUPERAR TU PARTIDA ANTERIOR?",
      mensaje: "Volverás a la partida que se guardó el " + new Date(r.fecha).toLocaleString("es-MX") +
        " (" + r.motivo + "): " + resumenPartida(r.partida) + ".\n\nTu partida de ahora se queda como respaldo, por si cambias de opinión.",
      textoConfirmar: "↩ Sí, recuperarla",
      textoCancelar: "Cancelar",
      tono: "amistoso"
    }, function () {
      releer();
      var actual = partida;
      partida = r.partida;
      if (!guardar(partida)) return;
      try {
        if (tieneAvance(actual)) {
          localStorage.setItem(CLAVE_RESPALDO, JSON.stringify({ fecha: Date.now(), motivo: "antes de recuperar el respaldo", partida: actual }));
        } else {
          localStorage.removeItem(CLAVE_RESPALDO);
        }
      } catch (e) { /* ya quedó recuperada, que es lo importante */ }
      toast("↩ ¡Partida recuperada!");
      setTimeout(function () { location.reload(); }, 1200);
    });
  }

  // ---------- Recordatorios para respaldar ----------
  function necesitaRespaldo() {
    var hechas = Object.keys(partida.lecciones).length;
    if (hechas === 0) return false;
    var ultimo = partida.extra.ultimoRespaldo;
    if (!ultimo) return hechas >= 2;
    var dias = (Date.now() - ultimo) / 86400000;
    return dias > 7 && hechas > (partida.extra.leccionesAlRespaldar || 0);
  }

  function sugerirRespaldo(nivel) {
    modalConfirmar({
      titulo: "🏅 ¡NIVEL COMPLETADO!",
      mensaje: "Ganaste la medalla «" + nivel.medalla.nombre + "» " + nivel.medalla.emoji +
        "\n\nEs buen momento para guardar tu partida en un archivo: si algún día se borra el navegador, con ese archivo recuperas TODO (XP, medallas y tu código).",
      textoConfirmar: "💾 Descargar mi partida",
      textoCancelar: "Ahora no",
      tono: "amistoso"
    }, exportarPartida);
  }

  // En el mapa: un aviso amable si hace mucho que no respaldas
  function pintarRecordatorio() {
    var mapa = document.getElementById("mapa-niveles");
    if (!mapa || !necesitaRespaldo()) return;
    var ultimo = partida.extra.ultimoRespaldo;
    var aviso = document.createElement("div");
    aviso.className = "cq-recordatorio";
    aviso.innerHTML = "<p></p>";
    aviso.querySelector("p").textContent = ultimo
      ? "💾 Hace " + Math.floor((Date.now() - ultimo) / 86400000) + " días que no respaldas tu partida y ya avanzaste más. ¡Descarga una copia nueva!"
      : "💾 Tu partida solo vive en este navegador. Si se borra el historial, se pierde. Descarga una copia por si acaso.";
    var btn = document.createElement("button");
    btn.className = "pg-btn";
    btn.textContent = "💾 Descargar mi partida";
    btn.addEventListener("click", exportarPartida);
    aviso.appendChild(btn);
    mapa.parentNode.insertBefore(aviso, mapa);
  }

  // ---------- Guardado automático del código de los ejercicios ----------
  // Cada editor (playground, Python, SQL) guarda lo que el alumno escribe
  // dentro de la partida, así también viaja al exportar/importar.

  // Identifica la página actual de forma estable (funciona igual en
  // el sitio publicado y abriendo el archivo local).
  function paginaActual() {
    var ruta = location.pathname.replace(/\\/g, "/");
    var m = ruta.match(/(niveles\/nivel-\d+\/[^\/]+)\.html$/);
    if (m) return m[1];
    var partes = ruta.split("/").filter(Boolean);
    return partes.slice(-2).join("/").replace(/\.html$/, "");
  }

  // Clave única para un ejercicio: página + tipo de editor + número,
  // o un nombre propio si el ejercicio trae data-guardar="...".
  function claveEjercicio(tipo, indice, personalizada) {
    return paginaActual() + "::" + (personalizada || tipo + indice);
  }

  // info (opcional) = { titulo, modo } del ejercicio, para "Mi baúl de código".
  // Se guarda en su propio cajón para que extra.codigo no cambie de forma.
  function guardarCodigo(clave, texto, info) {
    releer();
    partida.extra.codigo = partida.extra.codigo || {};
    var fichas = partida.extra.codigoInfo || (partida.extra.codigoInfo = {});
    if (texto === null || texto === undefined) {
      delete partida.extra.codigo[clave];
      delete fichas[clave];
    } else {
      partida.extra.codigo[clave] = texto;
      fichas[clave] = ficha(fichas[clave], info);
      fichas[clave].fecha = Date.now();
    }
    return guardar(partida);
  }

  function ficha(vieja, info) {
    var f = vieja || {};
    if (info && info.titulo) f.titulo = info.titulo;
    if (info && info.modo) f.modo = info.modo;
    return f;
  }

  // El código que se guardó antes de existir el baúl no trae su ficha:
  // se la ponemos la próxima vez que el alumno abre esa lección.
  function registrarInfoCodigo(clave, info) {
    var fichas = partida.extra.codigoInfo;
    if (typeof (partida.extra.codigo || {})[clave] !== "string") return;
    if (fichas && fichas[clave] && fichas[clave].titulo) return;
    releer();
    fichas = partida.extra.codigoInfo || (partida.extra.codigoInfo = {});
    fichas[clave] = ficha(fichas[clave], info);
    guardar(partida);
  }

  function codigoGuardado(clave) {
    var caja = partida.extra.codigo;
    return caja && typeof caja[clave] === "string" ? caja[clave] : null;
  }

  // Todo el código guardado, en el orden del curso (para el baúl)
  function listarCodigo() {
    var caja = partida.extra.codigo || {};
    var fichas = partida.extra.codigoInfo || {};
    var lista = [];
    Object.keys(caja).forEach(function (clave) {
      if (typeof caja[clave] !== "string") return;
      var partes = clave.split("::");
      var pagina = partes[0];
      var ejercicio = partes.slice(1).join("::");
      var m = pagina.match(/^niveles\/(nivel-\d+)\/(.+)$/);
      var nivel = null, leccion = null, orden = 9999;
      if (m) {
        CURSO.forEach(function (n, i) {
          if (n.carpeta !== m[1]) return;
          nivel = n;
          n.lecciones.forEach(function (l, j) {
            if (l.archivo === m[2] + ".html") { leccion = l; orden = i * 100 + j; }
          });
        });
      }
      var num = ejercicio.match(/^(pg|py|sql)(\d+)$/);
      lista.push({
        clave: clave,
        pagina: pagina,
        ancla: "cq-" + ejercicio,
        tipo: num ? num[1] : "",
        numero: num ? parseInt(num[2], 10) : 0,
        texto: caja[clave],
        info: fichas[clave] || {},
        nivel: nivel,
        leccion: leccion,
        orden: orden
      });
    });
    lista.sort(function (a, b) { return a.orden - b.orden || a.numero - b.numero; });
    return lista;
  }

  // ---------- Escudo para el código de los alumnos ----------
  // Los ejercicios corren en la misma "memoria del navegador" donde vive
  // la partida. Este escudo hace que localStorage.clear() y compañía
  // borren SOLO lo del alumno y nunca la partida (claves "codequest-…").
  var ESCUDO_JS =
    "(function(){try{var S=Storage.prototype,ls=window.localStorage," +
    "p=function(k){return String(k).indexOf('codequest-')===0}," +
    "c=S.clear,r=S.removeItem,s=S.setItem;" +
    "S.clear=function(){if(this!==ls)return c.call(this);" +
    "for(var i=this.length-1;i>=0;i--){var k=this.key(i);if(!p(k))r.call(this,k);}};" +
    "S.removeItem=function(k){if(this===ls&&p(k))return;return r.call(this,k);};" +
    "S.setItem=function(k,v){if(this===ls&&p(k))return;return s.call(this,k,v);};" +
    "}catch(e){}})();";

  // Mete un <script> al principio de una página HTML del alumno sin
  // cambiarle los números de línea (todo va en la misma línea) y sin
  // ponerlo antes del <!DOCTYPE> (eso cambiaría cómo se ve la página).
  function conEscudo(html, scriptExtra) {
    var etiqueta = "<script>" + ESCUDO_JS + (scriptExtra || "") + "<\/script>";
    var m = html.match(/<head(\s[^>]*)?>/i) || html.match(/<!doctype[^>]*>/i);
    if (m) {
      var corte = m.index + m[0].length;
      return html.slice(0, corte) + etiqueta + html.slice(corte);
    }
    return etiqueta + html;
  }

  // ---------- Modal de confirmación (estilo "borrar save") ----------
  function modalConfirmar(opciones, alConfirmar) {
    var viejo = document.querySelector(".cq-modal-fondo");
    if (viejo) viejo.remove();

    var amistoso = opciones.tono === "amistoso";
    var fondo = document.createElement("div");
    fondo.className = "cq-modal-fondo";
    var modal = document.createElement("div");
    modal.className = "cq-modal" + (amistoso ? " amistoso" : "");
    modal.setAttribute("role", "alertdialog");
    modal.innerHTML =
      '<div class="cq-modal-titulo"></div>' +
      '<p class="cq-modal-mensaje"></p>' +
      '<div class="cq-modal-botones">' +
      '<button type="button" class="cq-modal-btn cancelar"></button>' +
      '<button type="button" class="cq-modal-btn peligro"></button>' +
      "</div>";
    modal.querySelector(".cq-modal-titulo").textContent = opciones.titulo || "⚠️ ¿Estás seguro?";
    modal.querySelector(".cq-modal-mensaje").textContent = opciones.mensaje || "";
    var btnCancelar = modal.querySelector(".cancelar");
    var btnConfirmar = modal.querySelector(".peligro");
    btnCancelar.textContent = opciones.textoCancelar || "↩ Cancelar";
    btnConfirmar.textContent = opciones.textoConfirmar || "🗑️ Sí, borrar";
    if (amistoso) {
      btnCancelar.className = "cq-modal-btn secundario";
      btnConfirmar.className = "cq-modal-btn principal";
    }
    fondo.appendChild(modal);
    document.body.appendChild(fondo);

    function cerrar() {
      fondo.remove();
      document.removeEventListener("keydown", conEscape);
    }
    function cancelar() {
      cerrar();
      if (opciones.alCancelar) opciones.alCancelar();
    }
    function conEscape(e) {
      if (e.key === "Escape") cancelar();
    }
    btnCancelar.addEventListener("click", cancelar);
    fondo.addEventListener("click", function (e) {
      if (e.target === fondo) cancelar();
    });
    btnConfirmar.addEventListener("click", function () {
      cerrar();
      if (alConfirmar) alConfirmar();
    });
    document.addEventListener("keydown", conEscape);
    // El botón seguro queda seleccionado: Enter por accidente no borra nada
    (amistoso ? btnConfirmar : btnCancelar).focus();
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
    var racha = document.querySelector(".cq-racha");
    if (racha) {
      var dias = rachaActual();
      racha.hidden = dias === 0;
      racha.textContent = "🔥 " + dias;
      racha.title = dias === 1
        ? "Programaste hoy: ¡vuelve mañana para empezar tu racha!"
        : dias + " días seguidos programando. ¡No rompas la racha!";
    }
  }

  function inyectarHeader() {
    if (document.querySelector(".cq-header")) { pintarHeader(); return; }
    var header = document.createElement("header");
    header.className = "cq-header";
    header.innerHTML =
      '<a class="cq-logo" href="' + BASE + 'index.html">🕹️ CODE QUEST</a>' +
      '<span class="cq-rango"></span>' +
      '<span class="cq-racha" hidden></span>' +
      '<div class="cq-xp-zona"><div class="cq-xp-barra"><div class="cq-xp-relleno"></div></div>' +
      '<div class="cq-xp-texto"></div></div>' +
      '<nav class="cq-header-links">' +
      '<a href="' + BASE + 'index.html">🗺️ Mapa</a>' +
      '<a href="' + BASE + 'arcade/index.html">👾 Arcade</a>' +
      '<a href="' + BASE + 'recursos/index.html">📚 Recursos</a>' +
      '<a href="' + BASE + 'baul.html">🧰 Mi código</a>' +
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

  // ---------- Interfaz: tu avance dentro de cada nivel ----------
  // En la portada del nivel: ✅ en las lecciones hechas y el botón te
  // lleva a la que sigue. En cada lección: "Lección 3 de 6" con puntitos.
  function pintarAvanceNivel() {
    var m = location.pathname.replace(/\\/g, "/").match(/niveles\/(nivel-\d+)\/([^\/]+\.html)$/);
    if (!m) return;
    var nivel = null;
    CURSO.forEach(function (n) { if (n.carpeta === m[1]) nivel = n; });
    if (!nivel) return;
    function leccionPorArchivo(archivo) {
      return nivel.lecciones.filter(function (l) { return l.archivo === archivo; })[0];
    }

    if (m[2] === "index.html") {
      document.querySelectorAll("main ol li > a").forEach(function (a) {
        var l = leccionPorArchivo(a.getAttribute("href"));
        if (l && leccionCompletada(l.id)) {
          a.parentNode.classList.add("cq-hecha");
          a.insertAdjacentText("beforebegin", "✅ ");
        }
      });
      var prog = progresoNivel(nivel);
      var btn = document.querySelector('main a.btn[href="leccion-1.html"]');
      var pendiente = nivel.lecciones.filter(function (l) { return !leccionCompletada(l.id); })[0];
      if (btn && prog.hechas > 0) {
        if (pendiente) {
          btn.href = pendiente.archivo;
          btn.textContent = "▶ Seguir: Lección " + (nivel.lecciones.indexOf(pendiente) + 1);
        } else {
          btn.textContent = "✅ ¡Nivel completado! Repasar desde la Lección 1";
        }
      }
      return;
    }

    var actual = leccionPorArchivo(m[2]);
    var etiqueta = document.querySelector(".etiqueta-leccion");
    if (!actual || !etiqueta) return;
    var ruta = document.createElement("div");
    ruta.className = "cq-ruta-nivel";
    var texto = document.createElement("span");
    texto.className = "cq-ruta-texto";
    texto.textContent = "Lección " + (nivel.lecciones.indexOf(actual) + 1) + " de " + nivel.lecciones.length;
    ruta.appendChild(texto);
    nivel.lecciones.forEach(function (l, i) {
      var punto = document.createElement("a");
      punto.href = l.archivo;
      punto.className = "cq-punto" + (leccionCompletada(l.id) ? " hecho" : "") + (l === actual ? " actual" : "");
      punto.title = "Lección " + (i + 1) + ": " + l.titulo + (leccionCompletada(l.id) ? " ✅" : "");
      punto.setAttribute("aria-label", punto.title);
      ruta.appendChild(punto);
    });
    etiqueta.parentNode.insertBefore(ruta, etiqueta.nextSibling);
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
      document.querySelectorAll(".cq-punto.actual").forEach(function (p) { p.classList.add("hecho"); });
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

  // ---------- Traductor de errores 🕵️ (vive en errores.js) ----------
  // lenguaje: "python" | "js" | "sql". Regresa una promesa con la pista
  // en español, o null si no conocemos ese error.
  function explicarError(lenguaje, mensaje) {
    return cargarScript(BASE + "assets/js/errores.js?v=2")
      .then(function () {
        return window.CodeQuestErrores ? window.CodeQuestErrores.explicar(lenguaje, String(mensaje || "")) : null;
      })
      .catch(function () { return null; });
  }

  // Pone debajo de un error la "pista del detective", si la hay
  function pistaDetective(contenedor, lenguaje, mensaje) {
    return explicarError(lenguaje, mensaje).then(function (pista) {
      if (!pista || !contenedor) return;
      var div = document.createElement("div");
      div.className = "pista-detective";
      div.innerHTML = "<strong>🕵️ Pista del detective:</strong> <span></span>";
      div.querySelector("span").textContent = pista;
      contenedor.appendChild(div);
    });
  }

  // Cada ejercicio tiene su ancla (#cq-py2) para llegar directo desde el baúl
  function anclarEjercicio(caja, ejercicio) {
    var ancla = "cq-" + ejercicio;
    if (!caja.id) caja.id = ancla;
    if (location.hash === "#" + ancla) {
      setTimeout(function () {
        caja.scrollIntoView({ behavior: "smooth", block: "center" });
        caja.classList.add("cq-resaltado");
        setTimeout(function () { caja.classList.remove("cq-resaltado"); }, 2600);
      }, 400);
    }
  }

  // ⌘+Enter (Mac) o Ctrl+Enter (Windows) para ejecutar, como los pros
  function atajoEjecutar(elemento, accion) {
    elemento.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        accion();
      }
    });
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
    leerRespaldo: leerRespaldo,
    recuperarRespaldo: recuperarRespaldo,
    claveEjercicio: claveEjercicio,
    guardarCodigo: guardarCodigo,
    codigoGuardado: codigoGuardado,
    registrarInfoCodigo: registrarInfoCodigo,
    listarCodigo: listarCodigo,
    conEscudo: conEscudo,
    ESCUDO_JS: ESCUDO_JS,
    evento: evento,
    explicarError: explicarError,
    pistaDetective: pistaDetective,
    anclarEjercicio: anclarEjercicio,
    atajoEjecutar: atajoEjecutar,
    LOGROS: LOGROS,
    logroGanado: logroGanado,
    rachaActual: rachaActual,
    mejorRacha: function () { return (partida.extra.racha && partida.extra.racha.mejor) || 0; },
    estadisticas: function () { return estadisticas(); },
    ultimoRespaldo: function () { return partida.extra.ultimoRespaldo || null; },
    modalConfirmar: modalConfirmar,
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
    pintarRecordatorio();
    pintarAvanceNivel();
    conectarBotonCompletar();
    conectarChecklists();
    revisarLogrosAlEntrar();
  });

  // Si otra pestaña cambió la partida, esta se pone al día
  window.addEventListener("storage", function (e) {
    if (e.key !== CLAVE) return;
    releer();
    pintarHeader();
  });
})();
