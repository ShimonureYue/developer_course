/* ============================================================
   CODE QUEST — Traductor de errores 🕵️
   Los mensajes de error vienen en inglés y suenan a regaño.
   Aquí cada error común trae una "pista del detective" en
   español. El error original SIEMPRE se sigue mostrando: leerlo
   es una habilidad de programador. Esto solo es el subtítulo.

   Cada regla: { busca: /patrón/, pista: function (m) { … } }
   m es el resultado del patrón (m[1] = lo que va entre paréntesis).
   ============================================================ */

(function () {
  "use strict";

  var PYTHON = [
    {
      busca: /NameError: name '([^']+)' is not defined/,
      pista: function (m) {
        return "Python no conoce «" + m[1] + "». Revisa: ¿lo escribiste EXACTAMENTE igual que cuando lo creaste " +
          "(mayúsculas, acentos y guiones bajos cuentan)? ¿Lo creaste ANTES de usarlo? " +
          "Si era un texto, ¿le faltan las comillas?";
      }
    },
    {
      busca: /IndentationError: expected an indented block/,
      pista: function () {
        return "Después de una línea que termina en dos puntos (if, else, for, while, def…) " +
          "lo de adentro debe ir recorrido 4 espacios a la derecha. Aquí falta ese recorrido.";
      }
    },
    {
      busca: /IndentationError: unexpected indent/,
      pista: function () {
        return "Hay una línea recorrida a la derecha sin razón. Solo se recorre lo que está ADENTRO de un " +
          "if, for, while o def. Pégala a la izquierda como sus vecinas.";
      }
    },
    {
      busca: /(IndentationError|TabError): (unindent does not match|inconsistent use)/,
      pista: function () {
        return "Las líneas de un mismo bloque no están alineadas a la misma altura. " +
          "Usa siempre 4 espacios por nivel y revisa que cada else quede justo debajo de su if.";
      }
    },
    {
      busca: /SyntaxError: unterminated string literal|SyntaxError: EOL while scanning string/,
      pista: function () {
        return "Abriste comillas y nunca las cerraste. Todo texto va entre un par de comillas: \"así\".";
      }
    },
    {
      busca: /SyntaxError: '(\(|\[|\{)' was never closed/,
      pista: function (m) {
        var cierre = { "(": ")", "[": "]", "{": "}" }[m[1]];
        return "Abriste un «" + m[1] + "» y nunca lo cerraste con «" + cierre + "». " +
          "Cuenta: cada uno que abres necesita su pareja.";
      }
    },
    {
      busca: /SyntaxError: expected ':'/,
      pista: function () {
        return "Te faltan los dos puntos «:» al final de la línea. Los if, elif, else, for, while y def " +
          "siempre terminan en «:» (es como decir «entonces:»).";
      }
    },
    {
      busca: /Maybe you meant '==' or ':=' instead of '='|cannot assign to (expression|comparison) here|invalid syntax\. Perhaps you forgot a comma/,
      pista: function (m) {
        if (/forgot a comma/.test(m[0])) {
          return "Parece que falta una coma «,» entre dos cosas, por ejemplo dentro de un print() o de una lista.";
        }
        return "¡El clásico! Para PREGUNTAR si dos cosas son iguales se usan dos iguales «==». " +
          "Un solo «=» sirve para GUARDAR un valor en una variable.";
      }
    },
    {
      busca: /SyntaxError: (invalid syntax|unexpected EOF|incomplete input)/,
      pista: function () {
        return "Python no entendió cómo está escrita esa línea. Sospechosos de siempre: dos puntos «:» " +
          "que faltan, paréntesis o comillas sin cerrar, o una palabra mal escrita (como «pirnt»).";
      }
    },
    {
      busca: /TypeError: can only concatenate str \(not "(\w+)"\) to str/,
      pista: function () {
        return "Estás pegando (+) un texto con un número, y Python no sabe mezclarlos. " +
          "Convierte el número a texto con str(numero), o en el print sepáralos con comas: print(\"Puntos:\", puntos).";
      }
    },
    {
      busca: /TypeError: unsupported operand type\(s\) for [^:]+: '(\w+)' and '(\w+)'/,
      pista: function (m) {
        return "Intentaste hacer cuentas entre un «" + m[1] + "» y un «" + m[2] + "». " +
          "Si uno viene de input(), recuerda que input() SIEMPRE da texto: conviértelo con int(…).";
      }
    },
    {
      busca: /TypeError: '([<>]=?)' not supported between instances of '(\w+)' and '(\w+)'/,
      pista: function () {
        return "Estás comparando un texto con un número. Casi siempre es porque input() da texto: " +
          "usa int(input(\"…\")) para convertir la respuesta en número.";
      }
    },
    {
      busca: /TypeError: (\w+)\(\) missing (\d+) required positional argument/,
      pista: function (m) {
        return "La función " + m[1] + "() necesita " + m[2] + " ingrediente(s) más (parámetros) y no se los diste. " +
          "Revisa cuántos pide en su «def» y pásaselos entre los paréntesis.";
      }
    },
    {
      busca: /TypeError: (\w+)\(\) takes (\d+) positional arguments? but (\d+) (were|was) given/,
      pista: function (m) {
        return "La función " + m[1] + "() recibe " + m[2] + " ingrediente(s), pero le diste " + m[3] + ". " +
          "Compara su «def» con la línea donde la llamas.";
      }
    },
    {
      busca: /TypeError: '(\w+)' object is not callable/,
      pista: function (m) {
        return "Pusiste paréntesis después de algo que no es función (un «" + m[1] + "»). " +
          "¿Quizás le pusiste a una variable el mismo nombre que a una función, como print = …?";
      }
    },
    {
      busca: /ValueError: invalid literal for int\(\) with base 10: '([^']*)'/,
      pista: function (m) {
        return m[1] === ""
          ? "int() recibió un texto vacío: le diste Aceptar sin escribir nada. Ejecuta de nuevo y escribe un número."
          : "int() solo sabe convertir textos que son números, y recibió «" + m[1] + "». Escribe solo dígitos, sin letras ni espacios.";
      }
    },
    {
      busca: /ZeroDivisionError/,
      pista: function () {
        return "Dividiste entre cero, y eso ni las matemáticas lo permiten. " +
          "Revisa qué variable vale 0 en esa división.";
      }
    },
    {
      busca: /IndexError: list index out of range/,
      pista: function () {
        return "Pediste una posición que la lista no tiene. Recuerda que se cuenta desde 0: " +
          "una lista de 3 cosas tiene las posiciones 0, 1 y 2 (la 3 ya no existe).";
      }
    },
    {
      busca: /KeyError: (.+)/,
      pista: function (m) {
        return "Buscaste la clave " + m[1] + " y no existe. Revisa que esté escrita igualita (mayúsculas y acentos).";
      }
    },
    {
      busca: /AttributeError: '(\w+)' object has no attribute '(\w+)'/,
      pista: function (m) {
        return "Un «" + m[1] + "» no sabe hacer «." + m[2] + "». Revisa la ortografía del método " +
          "o si esa variable es del tipo que crees.";
      }
    },
    {
      busca: /UnboundLocalError: (cannot access local variable|local variable) '(\w+)'/,
      pista: function (m) {
        return "Dentro de la función usas «" + m[2] + "» antes de darle valor ahí adentro. " +
          "Las funciones tienen su propia caja de variables: pásalo como parámetro.";
      }
    },
    {
      busca: /ModuleNotFoundError: No module named '([^']+)'/,
      pista: function (m) {
        return "No existe el módulo «" + m[1] + "» aquí. Revisa cómo lo escribiste (por ejemplo: import random).";
      }
    },
    {
      busca: /RecursionError/,
      pista: function () {
        return "Una función se llama a sí misma sin parar, como dos espejos frente a frente. " +
          "Revisa que tenga una condición para detenerse.";
      }
    }
  ];

  var JS = [
    {
      busca: /ReferenceError: ([\w$]+) is not defined|ReferenceError: Can't find variable: ([\w$]+)/,
      pista: function (m) {
        var nombre = m[1] || m[2];
        return "JavaScript no conoce «" + nombre + "». ¿Lo escribiste igual que cuando lo creaste con let, const o function? " +
          "(mayúsculas cuentan: puntos ≠ Puntos). Si era texto, ¿le faltan comillas?";
      }
    },
    {
      busca: /Cannot access '([\w$]+)' before initialization/,
      pista: function (m) {
        return "Usaste «" + m[1] + "» antes de la línea donde lo creas con let o const. Muévelo más arriba.";
      }
    },
    {
      busca: /Cannot (read|set) propert(y|ies) of null|null is not an object/,
      pista: function () {
        return "Algo vale null: casi siempre es un document.getElementById(\"…\") o querySelector que NO encontró " +
          "el elemento. Revisa que el id sea idéntico en el HTML y en el JavaScript, y que el elemento exista.";
      }
    },
    {
      busca: /Cannot (read|set) propert(y|ies) of undefined|undefined is not an object/,
      pista: function () {
        return "Algo vale undefined (vacío). Pistas: una posición de arreglo que no existe, " +
          "una propiedad mal escrita, o una variable a la que nunca le diste valor.";
      }
    },
    {
      busca: /TypeError: ([\w$.]+) is not a function/,
      pista: function (m) {
        return "«" + m[1] + "» no es una función. Revisa la ortografía (por ejemplo addEventListener, getElementById: " +
          "mayúsculas incluidas) o si esa variable guarda lo que crees.";
      }
    },
    {
      busca: /Assignment to constant variable/,
      pista: function () {
        return "Intentaste cambiarle el valor a una const. Si esa variable debe cambiar, créala con let en vez de const.";
      }
    },
    {
      busca: /Identifier '([\w$]+)' has already been declared|Can't create duplicate variable: '([\w$]+)'/,
      pista: function (m) {
        return "Creaste «" + (m[1] || m[2]) + "» dos veces con let/const. Créalo una vez; después solo cámbiale el valor sin let.";
      }
    },
    {
      busca: /Unexpected end of input|Unexpected EOF/,
      pista: function () {
        return "Al código le falta cerrar algo: casi siempre una llave «}» o un paréntesis «)». " +
          "Cuenta las que abres y las que cierras.";
      }
    },
    {
      busca: /missing \) after argument list|Expected '\)'/,
      pista: function () {
        return "Falta cerrar un paréntesis «)», o falta una coma o un «+» entre dos cosas dentro de los paréntesis.";
      }
    },
    {
      busca: /Invalid or unexpected token|Unexpected token|Unexpected identifier|Unexpected string|Unexpected number/,
      pista: function () {
        return "JavaScript encontró algo que no esperaba en esa línea. Sospechosos: comillas sin cerrar, " +
          "una coma o «+» que falta, o una llave/paréntesis de más o de menos.";
      }
    },
    {
      busca: /Maximum call stack size exceeded/,
      pista: function () {
        return "Una función se llama a sí misma sin parar. Revisa que tenga una forma de detenerse.";
      }
    }
  ];

  var SQL = [
    {
      busca: /no such table: (\S+)/,
      pista: function (m) {
        return "No existe la tabla «" + m[1] + "». La tabla de ejemplo se llama «jugadores» (en plural y sin acento).";
      }
    },
    {
      busca: /no such column: (\S+)/,
      pista: function (m) {
        return "No existe la columna «" + m[1] + "». Las columnas son: id, nombre, juego, puntos, ciudad. " +
          "Si querías un texto, ponlo entre comillas: 'Snake'.";
      }
    },
    {
      busca: /near "([^"]+)": syntax error/,
      pista: function (m) {
        return "SQL se confundió cerca de «" + m[1] + "». Revisa el orden: SELECT … FROM … WHERE … ORDER BY …, " +
          "las comas entre columnas y que los textos vayan entre comillas.";
      }
    },
    {
      busca: /incomplete input|unrecognized token/,
      pista: function () {
        return "La consulta quedó incompleta: ¿cerraste las comillas y los paréntesis? ¿Termina con «;»?";
      }
    },
    {
      busca: /(\d+) values for (\d+) columns/,
      pista: function (m) {
        return "Diste " + m[1] + " valores para " + m[2] + " columnas. En un INSERT, cada columna necesita exactamente un valor.";
      }
    }
  ];

  var REGLAS = { python: PYTHON, js: JS, sql: SQL };

  function explicar(lenguaje, mensaje) {
    var reglas = REGLAS[lenguaje] || [];
    for (var i = 0; i < reglas.length; i++) {
      var m = mensaje.match(reglas[i].busca);
      if (m) return reglas[i].pista(m);
    }
    return null;
  }

  window.CodeQuestErrores = { explicar: explicar };
})();
