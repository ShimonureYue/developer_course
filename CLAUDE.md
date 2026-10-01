# CLAUDE.md — Code Quest

Curso de programación gamificado, en español de México, para jóvenes de 13 a 15 años
sin experiencia. Sitio 100% estático (HTML/CSS/JS puro, sin build ni servidor).
Publicado en https://rogeliovargas.com/code-quest/ y **con alumnos usándolo**.

## Cómo trabajar con Rogelio (el profe)

- Habla y escribe en **español sencillo**. Rogelio es profesor, no programador de oficio:
  explica cada decisión técnica con analogías y sin jerga (o explicándola).
- Piensa como maestro: el objetivo es que los alumnos **aprendan y se interesen**.
  Los textos para alumnos van en segunda persona, con tono cercano y mexicano.
- Antes de un cambio grande, propón un plan. Trabaja en una **rama + PR**, nunca directo en `main`.

## 🚨 Regla de oro: no romper las partidas de los alumnos

El progreso vive en el `localStorage` de cada navegador, en la clave `codequest-partida`:

```js
{ version: 1, xp, lecciones: {id: true}, quizzes: {id: true}, checklist: {id: true}, extra: {…} }
```

- **No cambies** esa clave ni la forma de `xp`, `lecciones`, `quizzes` o `checklist`.
  Lo nuevo va **dentro de `extra`** (ahí ya viven `codigo`, `codigoInfo`, `racha`, `stats`,
  `logros`, `ultimoRespaldo`, `checklistXP`…).
- **No cambies el XP** de lecciones/quizzes ni los rangos sin que Rogelio lo pida.
- El código de los alumnos se guarda **por posición del editor**:
  `extra.codigo["niveles/nivel-3/leccion-3::py2"]` = el 3er editor de Python de esa lección.
  En una lección existente, un editor nuevo va **al final** o con `data-guardar="nombre-propio"`.
  Nunca reordenes ni insertes editores antes de otros. Los IDs de lección (`n3-l3`) tampoco cambian.
- Cambiar el código inicial de un editor es seguro: si el alumno ya lo modificó, se queda con el suyo.
- Toda función nueva de `progress.js` que usen los editores se llama a través de `cq("nombre")`
  (con respaldo vacío), porque un navegador o CloudFront pueden tener todavía el `progress.js` viejo.

## Estructura

```
index.html, progreso.html, baul.html   portada/mapa, "Mi progreso", "Mi baúl de código"
niveles/nivel-N/leccion-M.html          lecciones (copiar niveles/plantilla-leccion.html)
arcade/                                 Gato, Snake y Space Invaders terminados
recursos/                               chuletas, glosario, guía de IA, guía del profe
assets/js/progress.js                   TEMARIO (única fuente de verdad), partida, XP, racha,
                                        logros, respaldos, header, escudo de localStorage
assets/js/playground.js                 editor HTML/JS con vista previa (iframe srcdoc)
assets/js/python-runner.js              Python con Pyodide + guardián de ciclos infinitos
assets/js/sql-runner.js                 SQL con sql.js
assets/js/errores.js                    "pista del detective": traduce errores comunes
assets/js/quiz.js, hints.js             mini-quizzes y pistas progresivas
herramientas/                           scripts del profe (NO se publican ni van en el zip)
```

Librerías externas (CodeMirror 5, Pyodide 0.26.4, sql.js) se cargan desde CDN en tiempo de ejecución.

## Al cambiar JS o CSS de `assets/`

Las páginas piden los archivos con versión: `progress.js?v=2`. Si cambias un `.js` o `.css`,
**sube el número en todas las páginas** (ej. a `?v=3`) para que el navegador del alumno no
mezcle una página nueva con un archivo viejo. Un reemplazo masivo con un script basta.

## Probar antes de publicar

```bash
cd herramientas && npm install           # solo la primera vez (usa el Chrome de la Mac)
node revisar-paginas.js                  # abre las ~75 páginas locales y reporta errores
node revisar-paginas.js https://rogeliovargas.com/code-quest/   # el sitio publicado
```

Para cambios al sistema de partidas, además: crea una partida con la versión de `main`
(lecciones, quiz, checklist y código en editores de Python/HTML/SQL), ábrela con la versión
nueva en el mismo navegador y verifica que todo siga intacto y en su mismo editor.
Probar también abriendo los archivos directo desde disco (`file://`), que el README ofrece.

## Publicar en rogeliovargas.com

```bash
python3 herramientas/publicar.py <carpeta-de-respaldo>              # simulación
python3 herramientas/publicar.py <carpeta-de-respaldo> --de-verdad  # publica
```

- Bucket S3 `rogeliovargas.com`, región `us-west-2`, prefijo `code-quest/`, detrás de CloudFront.
  Llaves en `~/.aws/credentials` (usuario `S3-User`, sin permisos de CloudFront).
- ⚠️ El bucket tiene **otras cosas de Rogelio** (`assets/`, `forgesteel/`, archivos en la raíz):
  solo se escribe bajo `code-quest/` y **nunca se borra nada**.
- El script respalda primero lo publicado, regenera `CodeQuest-para-compartir/` + `code-quest.zip`,
  sube con `Cache-Control` (HTML `no-cache`, lo demás `max-age=300`) y verifica MD5 = ETag.
- CloudFront **ignora el `?v=`** y guarda aparte la copia comprimida de cada archivo: tras publicar,
  algunos navegadores pueden recibir archivos viejos hasta 24 h. Para verlo todo al instante,
  Rogelio crea una invalidación de `/code-quest/*` en la consola de CloudFront.
- Después de publicar, corre `node revisar-paginas.js https://rogeliovargas.com/code-quest/`.
