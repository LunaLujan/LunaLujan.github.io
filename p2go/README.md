# Mi comunicador (prototipo CAA)

Una aplicación web sencilla inspirada en el concepto general de los comunicadores de Comunicación Aumentativa y Alternativa (CAA). **No es una copia de Proloquo2Go ni incluye sus pictogramas, marca o contenido propietario.**

## Funciones
- Tablero de palabras agrupadas por categorías.
- Frase visual que se construye al tocar pictogramas.
- Lectura de la frase con la voz disponible en el dispositivo (Web Speech API).
- Deshacer, borrar o quitar una palabra individual de la frase.
- Búsqueda dentro de la categoría actual.
- Ajuste de velocidad de voz y tamaño de las tarjetas.
- Agregar palabras propias, guardadas en el navegador mediante `localStorage`.
- Diseño adaptable a escritorio, tablet y móvil.

## Cómo usar
1. Descomprimí el archivo ZIP.
2. Abrí `index.html` en un navegador moderno (Chrome, Edge o Safari).
3. Tocá una categoría y después las tarjetas para formar una frase.
4. Tocá **Decir frase** para escucharla. La voz disponible depende del sistema operativo y del navegador.
5. En ⚙️ podés elegir voz, cambiar tamaño y agregar palabras.

No requiere instalación ni servidor para el uso básico. Para compartirlo en internet, subí los tres archivos (`index.html`, `styles.css`, `app.js`) a un hosting estático.

## Importante
Este prototipo es una demostración funcional, no un dispositivo clínicamente validado ni un reemplazo de una evaluación con fonoaudiología / terapia del lenguaje. Los emojis son símbolos de muestra y pueden no ser adecuados para todas las personas. Adaptá el vocabulario a la edad, idioma, necesidades motoras, visuales y comunicativas de cada usuario. La voz automática puede variar según el dispositivo y puede no funcionar en algunos navegadores.
