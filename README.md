# 🕹️ Code Quest — Aprende a programar creando videojuegos

Curso de programación **desde cero** para jóvenes de 13 a 15 años, en español.
Los alumnos empiezan sin saber nada y terminan construyendo su propio
**Space Invaders** 👾 — pasando por HTML, CSS, Python, JavaScript y bases de datos.

Todo el curso es un **sitio web estático**: no hay nada que instalar en el servidor,
no hay cuentas, no hay base de datos externa. El progreso de cada alumno se guarda
en su propio navegador.

## 🚀 Cómo usarlo (profe)

### Opción A: publicarlo en internet gratis con GitHub Pages (recomendada)

1. Crea un repositorio en [github.com](https://github.com) (por ejemplo `code-quest`).
2. Sube esta carpeta:
   ```bash
   cd developer_course
   git remote add origin https://github.com/TU-USUARIO/code-quest.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / carpeta `/ (root)` → Save**.
4. En un minuto tu curso queda en `https://TU-USUARIO.github.io/code-quest/`.
5. Comparte esa dirección con tus alumnos: solo necesitan un navegador. ✅

### Opción B: cada alumno con su copia local

1. Comparte el repositorio con los alumnos.
2. Ellos lo descargan (botón verde **Code → Download ZIP**) o lo clonan con git —
   la **Lección 1 del Nivel 0** los guía paso a paso (Mac y Windows), asumiendo que
   su computadora no tiene nada instalado.
3. Abren `index.html` con doble clic. Listo.

> 💡 Las dos opciones se combinan bien: publica la página para el día a día,
> y que cada alumno descargue su copia cuando empiece a editar código en VS Code.

## 📶 ¿Qué necesita el aula?

- **Internet**: la página descarga de internet el motor de Python (Pyodide),
  el editor de código con colores (CodeMirror), la mini base de datos (sql.js)
  y las tipografías. Sin internet, los textos se leen pero los editores interactivos no corren.
- **Un navegador moderno**: Chrome, Edge o Safari funcionan perfecto.
- **Cualquier computadora**: Mac (Intel o Apple Silicon M1–M4) y Windows por igual,
  porque todo corre dentro del navegador. Las lecciones de instalación (Nivel 0)
  y los atajos de teclado cubren los dos sistemas.
- Nada más. No se instala Python, ni Node, ni ningún programa para *ver* el curso.

## 🗺️ Estructura del curso

11 niveles, 49 lecciones. Cada nivel termina con un "proyecto jefe" 👑 que da una medalla:

| Nivel | Tema | Proyecto jefe |
|---|---|---|
| 0 🌮 | Instalación desde cero y bienvenida | Tu primer algoritmo |
| 1 🧱 | HTML | Mi tarjeta de gamer |
| 2 🎨 | CSS | Tu tarjeta con estilo |
| 3 🐍 | Python I: variables, decisiones, ciclos, listas | El oráculo |
| 4 🧩 | Python II: funciones | Adivina el número + Piedra-papel-tijera |
| 5 ⚡ | JavaScript | Taco Clicker 🌮 |
| 6 🎮 | Primer videojuego | Gato (tres en línea) |
| 7 💾 | Datos: JSON, localStorage, SQL | Tabla de récords |
| 8 🖌️ | Canvas y animación | Snake |
| 9 👾 | Proyecto final | Space Invaders |
| 10 🚀 | Retos (Tetris, Mario) y camino a Godot | Tu propio camino |

## 📁 Estructura de carpetas

```
index.html          → portada con el mapa de niveles
progreso.html       → partida guardada del alumno (XP, medallas, exportar/importar)
niveles/nivel-N/    → lecciones de cada nivel
arcade/             → los 3 juegos terminados, jugables desde el día 1
recursos/           → chuletas, glosario, guía de IA, guía del profe
assets/             → estilos y componentes (editores, quizzes, pistas, progreso)
niveles/plantilla-leccion.html → plantilla de referencia para crear nuevas lecciones
```

## 🧑‍🏫 Para dar la clase

Lee `recursos/guia-profe.html`: tiene tiempos sugeridos por nivel, los errores
más comunes de los alumnos y cómo apoyarlos sin resolverles todo.

## 🔧 Para modificar el curso

Todo es HTML/CSS/JS puro — se edita con cualquier editor. El temario
(niveles, lecciones, XP) vive en un solo lugar: `assets/js/progress.js`.
Si agregas una lección: crea el archivo HTML copiando la plantilla y añade
su entrada en ese temario.
